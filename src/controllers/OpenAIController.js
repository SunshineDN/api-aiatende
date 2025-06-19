import LeadMessagesRepository from "../repositories/LeadMessagesRepository.js";
import ThreadRepository from "../repositories/ThreadRepository.js";
import OpenAICrmServices from "../services/openai/OpenAICrmServices.js";
import OpenAIServices from "../services/openai/OpenAIServices.js";
import { intentionSpecialist } from "../services/workflows/intentionSpecialist.js";
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
    const assistant_name = process.env.OPENAI_ASSISTANT_NAME ? `Atendente ${process.env.OPENAI_ASSISTANT_NAME}` : "Atendente";
    const openai = new OpenAIServices({ lead_id, assistant_name });

    try {
      const decryptedAssistantId = atob(assistant_id);

      const { recent_messages, last_messages } = await leadMessageRepo.getLastAndRecentMessages({ lead_id });
      const userMessage = recent_messages || last_messages;

      styled.info(`[OpenAIController.runAssistant] - User message: ${userMessage}`);

      const crm_services = new OpenAICrmServices({ lead_id });
      await crm_services.getLead();

      const additional_instructions = await crm_services.getLeadAdditionalInfo();

      await crm_services.verifyLeadMessageField();

      const { message, messages_history } = await openai.handleRunAssistant({ assistant_id: decryptedAssistantId, userMessage, additional_instructions });

      await crm_services.saveAssistantAnswer({ message });

      await intentionSpecialist({ conversation_messages: messages_history, lead_id });

      styled.success(`[OpenAIController.runAssistant] - Assistente executado com sucesso!`);
      styled.successdir(message);
      res.status(200).json({ message });
    } catch (error) {
      if (!(error instanceof CustomError)) {
        styled.error(`[OpenAIController.runAssistant] - Erro inesperado ao executar assistente: ${error.message}`);
        return next(new CustomError({ statusCode: 500, message: error.message, lead_id }));
      }
    }
  }

  static async runAssistantAutoConfirm(req, res, next) {
    const { lead_id } = req.body;
    const assistant_id = req.params.assistant_id || process.env.OPENAI_ASSISTANT_ID;
    const assistant_name = process.env.OPENAI_ASSISTANT_NAME ? `Atendente ${process.env.OPENAI_ASSISTANT_NAME}` : "Atendente";
    const openai = new OpenAIServices({ lead_id, assistant_name });

    try {
      const decryptedAssistantId = atob(assistant_id);

      const userMessage = "Confirmado";

      styled.info(`[OpenAIController.runAssistant] - User message: ${userMessage}`);

      const crm_services = new OpenAICrmServices({ lead_id });
      await crm_services.getLead();

      const additional_instructions = await crm_services.getLeadAdditionalInfo();

      await crm_services.verifyLeadMessageField();

      const { message, messages_history } = await openai.handleRunAssistant({ assistant_id: decryptedAssistantId, userMessage, additional_instructions });

      await crm_services.saveAssistantAnswer({ message });

      await intentionSpecialist({ conversation_messages: messages_history, lead_id });

      styled.success(`[OpenAIController.runAssistant] - Assistente executado com sucesso!`);
      styled.successdir(message);
      res.status(200).json({ message });
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
    const assistant_name = process.env.OPENAI_ASSISTANT_NAME ? `Atendente ${process.env.OPENAI_ASSISTANT_NAME}` : "Atendente";
    const openai = new OpenAIServices({ lead_id, assistant_name });

    try {
      const decryptedAssistantId = atob(assistant_id);

      const crm_services = new OpenAICrmServices({ lead_id });
      await crm_services.getLead();

      const additional_instructions = await crm_services.getLeadAdditionalInfo();

      await crm_services.verifyLeadMessageField();

      styled.info(`[OpenAIController.runAssistantScheduled] - Executando assistente para lead agendado...`);
      const instructions = `
Execute a ferramenta "agendamento_ver" para recuperar o evento / agendamento criado pelo usuário. Em seguida, calcule quanto tempo falta a partir do momento atual até esse evento, e apresente:
- A data e hora exata do agendamento.
- Quantos dias, horas e minutos faltam até o evento.

Se não houver agendamentos, responda com: "❌ Nenhum agendamento encontrado."`

      const { message } = await openai.handleRunAssistant({ assistant_id: decryptedAssistantId, instructions, additional_instructions });

      await crm_services.saveAssistantAnswer({ message });

      styled.success(`[OpenAIController.runAssistantScheduled] - Assistente executado com sucesso!`);
      styled.successdir(message);
      res.status(200).json({ message });
    } catch (error) {
      if (!(error instanceof CustomError)) {
        styled.error(`[OpenAIController.runAssistantScheduled] - Erro inesperado ao executar assistente: ${error.message}`);
        return next(new CustomError({ statusCode: 500, message: error.message, lead_id }));
      }
    }
  }
}