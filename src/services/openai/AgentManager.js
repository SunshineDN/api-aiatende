import OpenAIAgent from "./OpenAIAgent.js";

export default class AgentManager {
  constructor() {
    this.agents = [];
  }

  /**
   * Adiciona um novo agente à lista de agentes
   * @param {{ name: string, systemPrompt: string, model?: string, apiKey?: string }} config
   */
  addAgent(config) {
    this.agents.push(new OpenAIAgent(config));
  };

  /**
   * Executa um agente pelo nome
   * @param {string} agentName
   * @param {number} lead_id
   * @param {string} userMessage
   * @returns {OpenAIAgent}
   */
  async runAgent(agentName, lead_id, userMessage) {
    const agent = this.agents.find(agent => agent.name === agentName);
    if (!agent) {
      throw new Error(`Agente ${agentName} não encontrado`);
    }

    return await agent.run({ lead_id, userMessage });
  }

  /**
   * Executa todos os agentes em ordem de adição
   * @param {number} lead_id
   * @param {string} initialMessage
   * @returns {Promise<Array<string>>}
   */
  async runGroup(lead_id, initialMessage) {
    let message = initialMessage;
    let i = 0;
    for (const agent of this.agents) {
      let persist = (i === 0);
      message = await agent.run({ lead_id, userMessage: message, persist });
      i++;
    }
    return message;
  }
}