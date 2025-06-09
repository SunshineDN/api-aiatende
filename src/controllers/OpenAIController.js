import LeadMessagesRepository from "../repositories/LeadMessagesRepository.js";
import OpenAIServices from "../services/openai/OpenAIServices.js";
import CustomError from "../utils/CustomError.js";
import styled from "../utils/log/styled.js";

export default class OpenAIController {

  static index(req, res, next) {
    try {
      res.status(200).json({ message: "OpenAI Controller is working!" });
    } catch (error) {
      if (!(error instanceof CustomError)) {
        styled.error(`[OpenAIController.index] - Erro inesperado na rota principal: ${error.message}`);
        return next(new CustomError({ statusCode: 500, message: error.message }));
      }
    }
  }

  static async runAssistant(req, res, next) {
    const { lead_id } = req.body;
    const assistant_id = req.params.assistant_id || process.env.OPENAI_ASSISTANT_ID;
    const leadMessageRepo = new LeadMessagesRepository();
    const openai = new OpenAIServices({ lead_id });

    try {
      const decryptedAssistantId = atob(assistant_id);

      const { recent_messages, last_messages } = await leadMessageRepo.getLastAndRecentMessages({ lead_id });
      const userMessage = recent_messages || last_messages;

      styled.info(`[OpenAIController.runAssistant] - User message: ${userMessage}`);

      const response = await openai.handleRunAssistant({ assistant_id: decryptedAssistantId, userMessage });
      styled.success(`[OpenAIController.runAssistant] - Assistente executado com sucesso!`);
      styled.successdir(response);
      res.status(200).json({ response });
    } catch (error) {
      if (!(error instanceof CustomError)) {
        styled.error(`[OpenAIController.runAssistant] - Erro inesperado ao executar assistente: ${error.message}`);
        return next(new CustomError({ statusCode: 500, message: error.message, lead_id }));
      }
    }
  }

  static async runAssistantScheduled(req, res, next) {
    const { lead_id } = req.body;
    const assistant_id = req.params.assistant_id || process.env.OPENAI_ASSISTANT_ID;
    const openai = new OpenAIServices({ lead_id });
    try {
      const decryptedAssistantId = atob(assistant_id);

      styled.info(`[OpenAIController.runAssistantScheduled] - Executando assistente para lead agendado...`);
      const instructions = `
Execute a ferramenta "agendamento_ver" para recuperar o evento / agendamento criado pelo usuário. Em seguida, calcule quanto tempo falta a partir do momento atual até esse evento, e apresente:
- A data e hora exata do agendamento.
- Quantos dias, horas e minutos faltam até o evento.

Se não houver agendamentos, responda com: "❌ Nenhum agendamento encontrado."`

      const response = await openai.handleRunAssistant({ assistant_id: decryptedAssistantId, instructions });
      styled.success(`[OpenAIController.runAssistantScheduled] - Assistente executado com sucesso!`);
      styled.successdir(response);
      res.status(200).json({ response });
    } catch (error) {
      if (!(error instanceof CustomError)) {
        styled.error(`[OpenAIController.runAssistantScheduled] - Erro inesperado ao executar assistente: ${error.message}`);
        return next(new CustomError({ statusCode: 500, message: error.message, lead_id }));
      }
    }
  }
}