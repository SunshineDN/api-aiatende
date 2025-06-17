import OpenAI from "openai";
import ThreadRepository from "../../repositories/ThreadRepository.js";
import CustomError from "../../utils/CustomError.js";
import styled from "../../utils/log/styled.js";
import OpenAIUtils from "../../utils/OpenAIUtils.js";
import { runAgendamentoAtualizar } from "./tools/runAgendamentoAtualizar.js";
import { runAgendamentoCriar } from "./tools/runAgendamentoCriar.js";
import { runAgendamentoDeletar } from "./tools/runAgendamentoDeletar.js";
import { runAgendamentoListarDatas } from "./tools/runAgendamentoListarDatas.js";
import { runAgendamentoVer } from "./tools/runAgendamentoVer.js";
import { runEspecialistaDados } from "./tools/runEspecialistaDados.js";
import { runEspecialistaImplantes } from "./tools/runEspecialistaImplantes.js";
import { runEspecialistaInvisalign } from "./tools/runEspecialistaInvisalign.js";

export default class OpenAIServices {
  #lead_id;

  /**
   * 
   * @param {Object} params
   * @param {number} params.lead_id - ID do lead. 
   * @param {string} [params.assistant_name] - Nome do assistente.
   */
  constructor({ lead_id = null, assistant_name = null } = {}) {
    this.#lead_id = lead_id;
    this.openai = new OpenAI(process.env.OPENAI_API_KEY);
    this.assistant_name = assistant_name;
  }

  /**
   * Executa o chat com o modelo.
   * @async
   * @param {Object} params
   * @param {string} params.model - Modelo a ser usado.
   * @param {string} params.userMessage - Mensagem do usuário.
   * @param {string} params.systemMessage - Mensagem do sistema.
   * @return {Promise<string>} - A resposta do modelo.
   */
  async chatCompletion({ model = "gpt-4.1-mini", userMessage = "", systemMessage = "" }) {
    const messages = [];

    if (systemMessage) {
      messages.push({ role: "system", content: systemMessage });
    };
    if (userMessage) {
      messages.push({ role: "user", content: userMessage });
    };

    const completions = await this.openai.chat.completions.create({
      model,
      messages,
      ...(this.#lead_id && { metadata: { lead_id: this.#lead_id.toString() } }),
    });

    return completions.choices[0].message.content;
  }

  /**
   * Executa o prompt completo com ferramentas.
   * @async
   * @param {Object} params
   * @param {Array} params.tools - Ferramentas a serem usadas.
   * @param {string} params.userMessage - Mensagem do usuário.
   * @param {string} params.systemMessage - Mensagem do sistema.
   * @param {string} params.model - Modelo a ser usado.
   * @param {Object} params.availableTools - Ferramentas disponíveis.
   * @return {Promise<string>} - A resposta do modelo.
   */
  async promptFull({ tools = [], userMessage = "", systemMessage = "", model = "gpt-4o-mini", availableTools = {} }) {
    const messages = [];

    if (systemMessage) {
      messages.push({ role: "system", content: systemMessage });
    };
    if (userMessage) {
      messages.push({ role: "user", content: userMessage });
    };

    const iterations = tools.length > 2 ? tools.length * 2 : 5;
    for (let i = 0; i < iterations; i++) {
      styled.info("[OpenAIServices.promptFull] Iteração:", i + 1, "de", iterations);
      styled.info("[OpenAIServices.promptFull] Mensagens:");
      styled.infodir(messages);

      const completions = await this.openai.chat.completions.create({
        model,
        messages,
        tools,
        ...(this.#lead_id && { metadata: { lead_id: this.#lead_id.toString() } }),
      });

      styled.info("[OpenAIServices.promptFull] Resposta da OpenAI:");
      styled.infodir(completions.choices[0]);

      const { finish_reason, message } = completions.choices[0];

      if (finish_reason === "tool_calls" && message.tool_calls) {
        const fnName = message.tool_calls[0].function.name;
        const fnArgs = JSON.parse(message.tool_calls[0].function.arguments);

        const result = await availableTools[fnName](fnArgs);
        styled.info("[OpenAIServices.promptFull] Tool Result:", result);
        messages.push({
          role: "function",
          name: fnName,
          content: result,
        });
      } else if (finish_reason === "stop") {
        styled.info("[OpenAIServices.promptFull] Resposta:", message.content);
        return message.content;
      } else {
        throw new Error("Erro ao executar a função");
      }
    }
  }

  /**
   * Executa o run do assistente.
   * @async
   * @param {Object} params
   * @param {string} params.userMessage - Mensagem do usuário.
   * @param {string} params.assistant_id - ID do assistente.
   * @param {string} [params.additional_instructions] - Instruções adicionais para o run.
   * @param {string} [params.instructions] - Instruções para o run.
   * @return {Promise<Object>} - A resposta do run e o histórico de mensagens atualizado.
   */
  async handleRunAssistant({ userMessage = "", assistant_id, additional_instructions = null, instructions = null } = {}) {
    const thread = await this.findOrCreateThread({ assistant_id });

    const sanitizedText = (userMessage ?? "").trim();
    const run = await this.openai.beta.threads.runs.createAndPoll(thread.thread_id, {
      assistant_id,
      additional_instructions,
      ...(sanitizedText && { additional_messages: [{ role: "user", content: sanitizedText }] }),
      ...(instructions && { instructions }),
    }, {
      pollIntervalMs: 1000,
      timeout: 15000,
      maxRetries: 2,
    });

    const message = await this.handleStatusRun({ run, thread_id: thread.thread_id });

    const repo = new ThreadRepository({ lead_id: this.#lead_id });
    const updated = await repo.storeMessage({ assistant_id, userMessage, assistantMessage: message });
    const messages_history = updated.messages;

    return { message, messages_history };
  }

  /**
   * Cria uma thread para o lead.
   * @param {Object} params
   * @param {string} params.assistant_id - ID do assistente.
   * @return {Promise<Object>} - A thread criada.
   */
  async findOrCreateThread({ assistant_id } = {}) {
    const repo = new ThreadRepository({ lead_id: this.#lead_id });
    let thread = await repo.findThread({ assistant_id });

    if (!thread) {
      styled.db("Thread não encontrada. Criando nova thread...");
      const newThread = await this.openai.beta.threads.create();
      thread = await repo.createThread({ thread_id: newThread.id, assistant_id });
    }

    return thread;
  }

  async handleRequiresAction({ run, thread_id }) {
    styled.info(`[OpenAIServices.handleRequiresAction] Lead ID: ${this.#lead_id} - Ação requerida: ${run.required_action.type}`);
    styled.infodir(run.required_action);

    if (run.required_action.type === "submit_tool_outputs") {
      const toolCalls = run.required_action.submit_tool_outputs.tool_calls;
      const tool_outputs_results = [];
      for (const toolCall of toolCalls) {
        const fnName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        // Executar a lógica local
        const result = await this.availableTools()[fnName](args);
        styled.info(`[OpenAIServices.handleRequiresAction] Tool Result: ${fnName}:`, JSON.stringify(result));
        tool_outputs_results.push({
          tool_call_id: toolCall.id,
          output: JSON.stringify(result)
        });
      }
      run = await this.openai.beta.threads.runs.submitToolOutputsAndPoll(thread_id, run.id, {
        tool_outputs: tool_outputs_results
      });
      styled.info(`[OpenAIServices.handleRequiresAction] Lead ID: ${this.#lead_id} - Resultado das ferramentas submetido com sucesso.`);
      return await this.handleStatusRun({ run, thread_id });
    } else {
      throw new CustomError({
        statusCode: 400,
        message: `Ação requerida não suportada: ${run.required_action.type}`,
        lead_id: this.#lead_id
      });
    }
  }

  async handleStatusRun({ run, thread_id }) {
    styled.info(`[OpenAIServices.handleStatusRun] Lead ID: ${this.#lead_id} - Status do run: ${run.status}`);
    styled.infodir(run);

    if (run.status === "completed") {
      const obtainMessage = await this.handleObtainMessage({ thread_id });
      styled.success(`[OpenAIServices.handleStatusRun] Lead ID: ${this.#lead_id} - Mensagem obtida com sucesso.`);
      return `*${this.assistant_name}*:\n\n${obtainMessage}`;
    } else if (run.status === "requires_action") {
      styled.info(`[OpenAIServices.handleStatusRun] Lead ID: ${this.#lead_id} - Ação requerida: ${run.required_action.type}`);
      return await this.handleRequiresAction({ run, thread_id });
    } else {
      styled.error(`[OpenAIServices.handleStatusRun] Lead ID: ${this.#lead_id} - Mensagem não obtida.`);
      styled.errordir(run);
      throw new CustomError({
        statusCode: 500,
        message: `Erro ao obter mensagem do run. Status: ${run.status}`,
        lead_id: this.#lead_id
      });
    }
  }

  /**
   * Obtém a mensagem da thread.
   * @param {Object} params
   * @param {string} params.thread_id - ID da thread.
   * @return {Promise<string|null>} - A mensagem obtida ou null se não houver mensagem.
   */
  async handleObtainMessage({ thread_id }) {
    const response = await this.openai.beta.threads.messages.list(thread_id);
    return response?.data[0]?.content[0]?.text?.value;
  }

  /**
   * Retorna as ferramentas disponíveis.
   * @returns {Object} - As ferramentas disponíveis.
   */
  availableTools() {
    return {
      'especialista_dados': runEspecialistaDados,
      'especialista_invisalign': runEspecialistaInvisalign,
      'especialista_implantes': runEspecialistaImplantes,
      'agendamento_criar': runAgendamentoCriar,
      'agendamento_deletar': runAgendamentoDeletar,
      'agendamento_listar_datas': runAgendamentoListarDatas,
      'agendamento_atualizar': runAgendamentoAtualizar,
      'agendamento_ver': runAgendamentoVer,
    }
  }

  async getDocument({ documentId }) {

  }

  async transcribeAudio(link, file_name) {
    try {
      const openaiUtils = new OpenAIUtils();

      styled.info('Downloading audio...');
      await openaiUtils.downloadFile(link, file_name);
      styled.success('Success\n');

      styled.info('Transcribing audio...');
      const transcription = await openaiUtils.transcribeAudio(file_name);
      styled.success('Success\n');

      styled.info('Deleting temporary file...');
      await openaiUtils.deleteTempFile(file_name);
      styled.success('Success\n');

      return transcription;
    } catch (error) {
      styled.error('Erro ao gravar audio no armazenamento:');
      console.error(error);
      throw new Error(error);
    }
  }

  async getThreadMessages({ thread_id }) {
    const response = await this.openai.beta.threads.messages.list(thread_id);
    if (response.data && response.data.length > 0) {
      return response.data.map(message => ({
        role: message.role,
        content: message.content.map(content => {
          if (content.type === "text") {
            return content.text.value;
          } else if (content.type === "file") {
            return {
              type: "file",
              file_id: content.file.id,
              file_name: content.file.name,
              file_url: content.file.url
            };
          } else {
            return content;
          }
        })[0] || null
      }));
    }
    return;
  }

  async createAssistant({ name, instructions, model = "gpt-4o-mini", tools = [] }) {
    if (!name || !instructions) {
      throw new CustomError({
        statusCode: 400,
        message: "Nome e instruções são obrigatórios para criar um assistente.",
        lead_id: this.#lead_id
      });
    }

    const response = await this.openai.beta.assistants.create({
      name,
      instructions,
      model,
      ...(tools.length > 0 && { tools }),
    });

    styled.success(`[OpenAIServices.createAssistant] Assistente criado com sucesso: ${response.id}`);
    return response;
  }
}