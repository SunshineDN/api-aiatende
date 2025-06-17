import OpenAIServices from "../services/openai/OpenAIServices.js";
import CustomError from "../utils/CustomError.js";
import styled from "../utils/log/styled.js";

export default class OpenAIWebController {

  static index(req, res, next) {
    try {
      res.status(200).json({ message: "OpenAI Controller is working!" });
    } catch (error) {
      if (!(error instanceof CustomError)) {
        styled.error(`[OpenAIWebController.index] - Erro inesperado na rota principal: ${error.message}`);
        return next(new CustomError({ statusCode: 500, message: error.message }));
      }
    }
  }

  static async send_message(req, res, next) {
    const { lead_id, message: userMessage } = req.body;
    const openai = new OpenAIServices({ lead_id });

    try {
      const assistant_id = req.params.assistant_id || atob(process.env.OPENAI_ASSISTANT_ID);

      styled.info(`[OpenAIWebController.runAssistant] - User message: ${userMessage}`);

      const { message, messages_history } = await openai.handleRunAssistant({ assistant_id, userMessage });

      styled.success(`[OpenAIWebController.runAssistant] - Assistente executado com sucesso!`);
      styled.successdir(message);
      res.status(200).json({ message });
    } catch (error) {
      if (!(error instanceof CustomError)) {
        styled.error(`[OpenAIWebController.runAssistant] - Erro inesperado ao executar assistente: ${error.message}`);
        return next(new CustomError({ statusCode: 500, message: error.message, lead_id }));
      }
    }
  }

  static async customAI(req, res, next) {
    const { niche } = req.body;

    try {
      const openai = new OpenAIServices();
      const assistant = await openai.createAssistant({
        name: `IA Especialista em ${niche}`,
        instructions: `Você é um especialista em ${niche}. Responda de forma clara, profissional e com foco em resolver problemas específicos da área.`
      });

      const prompt = `
      Você é um gerador de objetos JSON para configuração de assistentes virtuais.

      Sua tarefa é, a partir das informações fornecidas sobre um assistente (como nicho ou setor de atuação), gerar um objeto JSON com a seguinte estrutura, e retornar **apenas o objeto JSON em formato JSON.stringify**, sem nenhum texto explicativo antes ou depois:

      {
        id: "asst_zJZSIH8bVVzENET00X5GXpf7",
        name: "IA Especialista em ${niche}",
        description: "Especialista em ${niche} com conhecimento avançado do setor",
        status: "online",
        avatar: "🎯",
        specialties: ["${niche}", "Consultoria", "Estratégia"],
        isCustom: true
      }

      Exemplo de entrada:
      niche: "Odontologia Estética"

      Saída esperada:
      "{\\"id\\":\\"custom-1718642345678\\",\\"name\\":\\"IA Odontologia Estética\\",\\"description\\":\\"Especialista em Odontologia Estética com conhecimento avançado do setor\\",\\"status\\":\\"online\\",\\"avatar\\":\\"🦷\\",\\"specialties\\":[\\"Odontologia Estética\\",\\"Automação\\",\\"Análise de Dados\\"],\\"isCustom\\":true}"`

      const responseJsonStringify = await openai.chatCompletion({
        systemMessage: prompt,
        userMessage: `O assistente criado é: ${JSON.stringify(assistant)}`,
      });

      const parsedResponse = JSON.parse(responseJsonStringify);

      styled.success(`[OpenAIWebController.custom_assistant] - Assistente personalizado criado com sucesso!`);
      styled.successdir(parsedResponse);
      res.status(200).json(parsedResponse);
    } catch (error) {
      if (!(error instanceof CustomError)) {
        styled.error(`[OpenAIWebController.custom_assistant] - Erro inesperado ao criar assistente personalizado: ${error.message}`);
        return next(new CustomError({ statusCode: 500, message: error.message }));
      }
    }

  }
}