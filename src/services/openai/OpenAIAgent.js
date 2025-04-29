import OpenAIClient from "../../clients/OpenAIClient.js";
import MessageRepository from "../../repositories/MessageRepository.js";
import styled from "../../utils/log/styled.js";

export default class OpenAIAgent {
  #apiKey;
  #client;
  #repo = new MessageRepository();

  /**
   * @param {{ name: string, systemPrompt: string, model?: string, apiKey?: string }} config
   */
  constructor({ name, systemPrompt, model = 'gpt-3.5-turbo', apiKey }) {
    this.name = name;
    this.systemPrompt = systemPrompt;
    this.model = model;
    this.#apiKey = apiKey || process.env.OPENAI_API_KEY;
    this.#client = new OpenAIClient({ apiKey: this.#apiKey });
  }

  /**
   * Executa o agente para um lead específico, recuperando o contexto completo
   * @param {{ lead_id: number, userMessage: string }} args
   * @returns {Promise<string>} - Resposta do agente
   */
  async run({ lead_id, userMessage, persist = true }) {
    const history = await this.#repo.getHistory(lead_id);

    // Caso seja a primeira mensagem, adiciona o prompt do sistema
    if (!history.some(msg => msg.role === 'system')) {
      history.unshift({
        role: 'system',
        content: this.systemPrompt
      });
    }

    // Adiciona a mensagem do usuário ao histórico se persistir
    if (persist) {
      history.push({
        role: 'user',
        content: userMessage
      });
    }

    // Chama a API de chat completions
    const response = await this.#client.createChatCompletion({
      model: this.model,
      messages: history
    });

    styled.info(`Executando o agente ${this.name}...`);

    styled.info(`Histórico de mensagens:`);
    styled.infodir(history);

    styled.info(`Mensagem do usuário:`);
    styled.infodir(userMessage);

    styled.info(`Resposta do agente:`);
    styled.infodir(response);

    // Adiciona a resposta do agente ao histórico
    const agentMessage = response.choices[0].message.content;

    await this.#repo.bulkCreate([
      {
        lead_id,
        agent_name: this.name,
        role: 'user',
        content: userMessage
      },
      {
        lead_id,
        agent_name: this.name,
        role: 'assistant',
        content: agentMessage
      }
    ]);
    return agentMessage;
  }
}