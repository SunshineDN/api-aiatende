import OpenAI from "openai";

export default class OpenAIClient {
  #openai;

  /**
   * @param {{ apiKey: string }} config
   */
  constructor({ apiKey }) {
    this.#openai = new OpenAI(apiKey);
  }

  /**
   * @param {{ model: string, messages: Array<{ role: string, content: string }>, temperature?: number }} params
   * @returns {Promise<{ id: string, object: string, created: number, model: string, choices: Array<{ index: number, message: { role: string, content: string }, finish_reason: string }>, usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }>}
   */
  async createChatCompletion({ model, messages, temperature = 0.7 }) {
    const response = await this.#openai.chat.completions.create({
      model,
      messages,
      temperature
    });

    return response;
  }
};