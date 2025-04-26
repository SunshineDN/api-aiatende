import OpenAI from "openai";

export default class OpenAIClient {
  #apiKey = process.env.OPENAI_API_KEY;
  #openai;

  constructor() {
    this.#openai = new OpenAI(this.#apiKey);
  }

  async 
};