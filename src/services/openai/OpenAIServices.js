import OpenAI from "openai";

export default class OpenAIServices {
  constructor({}) {
    this.openai = new OpenAI(process.env.OPENAI_API_KEY);
  }

  async getDocument({ documentId }) {
    
  }
}