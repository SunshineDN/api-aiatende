import OpenAI from "openai";
import styled from "../../utils/log/styled.js";
import ThreadRepository from "../../repositories/ThreadRepository.js";
import { runEspecialistaDados } from "./tools/runEspecialistaDados.js";
import { runEspecialistaInvisalign } from "./tools/runEspecialistaInvisalign.js";
import { runEspecialistaImplantes } from "./tools/runEspecialistaImplantes.js";
import { runEspecialistaIntencao } from "./tools/runEspecialistaIntencao.js";
import { runAgendamentoCriar } from "./tools/runAgendamentoCriar.js";
import { runAgendamentoDeletar } from "./tools/runAgendamentoDeletar.js";
import { runAgendamentoListarDatas } from "./tools/runAgendamentoListarDatas.js";
import { runAgendamentoAtualizar } from "./tools/runAgendamentoAtualizar.js";
import { runAgendamentoVer } from "./tools/runAgendamentoVer.js";
import OpenAICrmServices from "./OpenAICrmServices.js";

export default class OpenAIServices {
  #lead_id;

  /**
   * 
   * @param {Object} params
   * @param {number} params.lead_id - ID do lead. 
   */
  constructor({ lead_id = null } = {}) {
    this.#lead_id = lead_id;
    this.openai = new OpenAI(process.env.OPENAI_API_KEY);
    this.assistant_name = "Assistente Gabriele";
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
  async chatCompletion({ model = "gpt-4o-mini", userMessage = "", systemMessage = "" }) {
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
   * @return {Promise<Object>} - O run criado.
   */
  async handleRunAssistant({ userMessage = "", assistant_id, additional_instructions = null, instructions = null } = {}) {
    const crm_services = new OpenAICrmServices({ lead_id: this.#lead_id });
    await crm_services.getLead();

    if (!additional_instructions) {
      additional_instructions = await crm_services.getLeadAdditionalInfo();
    }

    await crm_services.verifyLeadMessageField();

    const run = await this.handleCreateRun({
      userMessage,
      assistant_id,
      additional_instructions,
      ...(instructions && { instructions }),
    });

    styled.info(`[OpenAIServices.handleRunAssistant] Lead ID: ${this.#lead_id} - Run criado:`);
    styled.infodir(run);

    const message = await this.handleRetrieveRun({
      threadId: run.thread_id,
      runId: run.run_id,
    });

    // await crm_services.sendMessageToLead({ message });
    await crm_services.saveAssistantAnswer({ message });

    return message;
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
      const newThread = await this.openai.beta.threads.create({
        metadata: {
          lead_id: this.#lead_id.toString(),
        }
      });
      thread = await repo.createThread({ thread_id: newThread.id, assistant_id });
    }

    return thread;
  }

  /**
   * Verifica se há um run ativo para o assistente.
   * @param {Object} params
   * @param {string} params.assistant_id - ID do assistente.
   * @return {Promise<boolean>} - Retorna true se houver um run ativo, caso contrário false.
   */
  async verifyRunIsActive({ assistant_id }) {
    const repo = new ThreadRepository({ lead_id: this.#lead_id });
    const threads = await repo.findThreads({ assistant_id });

    if (threads.run_id) {
      const run = await this.openai.beta.threads.runs.retrieve(threads.thread_id, threads.run_id);
      styled.info(`[OpenAIServices.verifyRunIsActive] Lead ID: ${this.#lead_id} - Verificando run ativo...`);
      styled.infodir(run);
      if (run.status === "running") {
        styled.info(`[OpenAIServices.verifyRunIsActive] Lead ID: ${this.#lead_id} - Run ativo.`);
        return true;
      } else {
        styled.warning(`[OpenAIServices.verifyRunIsActive] Lead ID: ${this.#lead_id} - Run não está ativo.`);
        return false;
      }
    }
    styled.warning(`[OpenAIServices.verifyRunIsActive] Lead ID: ${this.#lead_id} - Nenhum run ativo encontrado.`);
    return false;
  }

  /**
   * Cria uma mensagem na thread e inicia o run.
   * @param {Object} params
   * @param {string} params.userMessage - Mensagem do usuário.
   * @param {string} params.assistant_id - ID do assistente.
   * @param {string} [params.additional_instructions] - Instruções adicionais para o run.
   * @return {Promise<Object>} - O run criado com o ID da thread e do run.
   */
  async handleCreateRun({ userMessage = "", assistant_id, additional_instructions = null, instructions = null } = {}) {
    const repo = new ThreadRepository({ lead_id: this.#lead_id });
    const sanitizedText = (userMessage ?? "").trim();

    const thread = await this.findOrCreateThread({ assistant_id });

    let thread_id, run_id;

    const runIsActive = await this.verifyRunIsActive({ assistant_id });

    if (!runIsActive) {
      await this.openai.beta.threads.messages.create(thread.thread_id, {
        role: "user",
        content: sanitizedText,
      });

      const run = await this.openai.beta.threads.runs.create(thread.thread_id, {
        assistant_id,
        ...(additional_instructions && { additional_instructions }),
        ...(instructions && { instructions }),
      });

      await repo.updateRun({ assistant_id, run_id: run.id });

      styled.info(`[OpenAIServices.handleCreateRun] Lead ID: ${this.#lead_id} - Run criado: ${run.id}`);
      thread_id = run.thread_id;
      run_id = run.id;
    } else {
      styled.info(`[OpenAIServices.handleCreateRun] Lead ID: ${this.#lead_id} - Run já ativo. Usando run existente.`);

      await repo.updateVoid({ assistant_id });

      thread_id = thread.thread_id;
      run_id = thread.run_id;
    }


    return {
      thread_id,
      run_id
    };
  }

  /**
   * Captura a mensagem do run.
   * @param {Object} params
   * @param {Object} params.run - O run criado.
   * @return {Promise<string|null>} - A mensagem capturada ou null se não houver mensagem.
   * */
  async handleRetrieveRun({ threadId, runId }) {
    let status, count = 2;

    while (true) {
      // 1) recuperar o status do run
      status = await this.openai.beta.threads.runs.retrieve(threadId, runId);
      styled.info(`[OpenAIServices.handleRetrieveRun] Lead ID: ${this.#lead_id} - Status do run: ${status.status}`);

      // 2) se precisar rodar tool...
      if (status.status === "requires_action") {
        const call = status.required_action;
        styled.info(`[OpenAIServices.handleRetrieveRun] Lead ID: ${this.#lead_id} - Ação requerida: ${call.type}`);
        styled.infodir(call);

        if (call.type === "submit_tool_outputs") {
          // 2.1 descompactar chamada
          const toolCalls = call.submit_tool_outputs.tool_calls;
          const tool_outputs_results = [];
          for (const toolCall of toolCalls) {
            const fnName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);

            // 2.2 executar sua lógica local
            const result = await this.availableTools()[fnName](args);
            styled.info(`[OpenAIServices.handleRetrieveRun] Tool Result: ${fnName}:`, JSON.stringify(result));
            tool_outputs_results.push({
              tool_call_id: toolCall.id,
              output: JSON.stringify(result)
            });
          }
          // 2.3 submeter o resultado das ferramentas ao run
          await this.openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
            tool_outputs: tool_outputs_results,
          });
          continue;
        }
      }

      if (status.status === "completed") {
        styled.info(`[OpenAIServices.handleRetrieveRun] Lead ID: ${this.#lead_id} - Run finalizado com sucesso.`);
        break;
      }

      if (status.status === "failed") {
        styled.error(`[OpenAIServices.handleRetrieveRun] Lead ID: ${this.#lead_id} - Run falhou.`);
        break;
      }

      if (status.status === "canceled") {
        styled.warning(`[OpenAIServices.handleRetrieveRun] Lead ID: ${this.#lead_id} - Run cancelado.`);
        break;
      }

      if (status.status === "running") {
        styled.info(`[OpenAIServices.handleRetrieveRun] Lead ID: ${this.#lead_id} - Run em execução.`);
      }

      await new Promise(r => setTimeout(r, 1000 * (count / 2)));
      count++;
    }

    if (status.status === "completed") {
      const obtainMessage = await this.handleObtainMessage({ thread_id: threadId });
      styled.success(`[OpenAIServices.handleRetrieveRun] Lead ID: ${this.#lead_id} - Mensagem obtida com sucesso.`);
      return `*${this.assistant_name}*:\n\n${obtainMessage}`;
    } else {
      styled.warning(`[OpenAIServices.handleRetrieveRun] Lead ID: ${this.#lead_id} - Mensagem não obtida.`);
      styled.warningdir(status);
      return null;
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
      'especialista_implante': runEspecialistaImplantes,
      'especialista_intencao': runEspecialistaIntencao,
      'agendamento_criar': runAgendamentoCriar,
      'agendamento_deletar': runAgendamentoDeletar,
      'agendamento_listar_datas': runAgendamentoListarDatas,
      'agendamento_atualizar': runAgendamentoAtualizar,
      'agendamento_ver': runAgendamentoVer,
    }
  }

  async getDocument({ documentId }) {

  }
}