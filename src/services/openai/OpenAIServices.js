import OpenAI from "openai";
import styled from "../../utils/log/styled.js";

export default class OpenAIServices {
  #lead_id;

  constructor({ lead_id }) {
    this.#lead_id = lead_id;
    this.openai = new OpenAI(process.env.OPENAI_API_KEY);
  }

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
      const completions = await this.openai.chat.completions.create({
        model,
        messages,
        tools,
      });

      const { finish_reason, message } = completions.choices[0];

      if (finish_reason === "tool_calls" && message.tool_calls) {
        const fnName = message.tool_calls[0].function.name;
        const fnArgs = JSON.parse(message.tool_calls[0].function.arguments);

        const result = await availableTools[fnName](fnArgs);
        const resultMessage = `O resultado da última função foi este: ${JSON.stringify(result)}`;
        styled.info("[OpenAIServices.promptFull] Tool Result:", resultMessage);
        messages.push({
          role: "function",
          name: fnName,
          content: resultMessage,
        });
      } else if (finish_reason === "stop") {
        styled.info("[OpenAIServices.promptFull] Resposta:", message.content);
        return message.content;
      } else {
        throw new Error("Erro ao executar a função");
      }
    }
  }

  async getDocument({ documentId }) {

  }
}