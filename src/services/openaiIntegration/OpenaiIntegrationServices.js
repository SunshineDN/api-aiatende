import styled from '../../utils/log/styled.js';
import OpenAIController from '../../controllers/OpenAIController.js';
import KommoUtils from '../../utils/KommoUtils.js';
import KommoServices from '../kommo/KommoServices.js';
import LeadThreadRepository from '../../repositories/LeadThreadRepository.js';
import LeadUtils from '../../utils/LeadUtils.js';
import StaticUtils from '../../utils/StaticUtils.js';
import EvolutionApiServices from '../evolutionapi/EvolutionApiServices.js';

export default class OpenaiIntegrationServices extends KommoServices {
  #evolutionApi;

  constructor({ auth, url }) {
    super({ auth, url });
    this.#evolutionApi = new EvolutionApiServices({ apiKey: process.env.EVOLUTION_API_KEY, instance: process.env.EVOLUTION_API_INSTANCE_ID });
  }

  async #saveAssistantMessage({ lead_id, message }) {
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields() });

    const answerField = kommoUtils.findLeadsFieldByName('GPT | Answer');
    const logField = kommoUtils.findLeadsFieldByName('GPT | LOG');
    const custom_fields_values = [
      {
        field_id: answerField.id,
        values: [
          {
            value: message
          }
        ]
      },
      {
        field_id: logField.id,
        values: [
          {
            value: 'ok'
          }
        ]
      }
    ]

    const response = await this.updateLead({ id: lead_id, custom_fields_values });
    return response;
  }

  async #savePromptMessage({ lead_id, message }) {
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields() });

    const answerField = kommoUtils.findLeadsFieldByName('GPT | Intent');
    const logField = kommoUtils.findLeadsFieldByName('GPT | LOG');
    const custom_fields_values = [
      {
        field_id: answerField.id,
        values: [
          {
            value: message
          }
        ]
      },
      {
        field_id: logField.id,
        values: [
          {
            value: 'ok'
          }
        ]
      }
    ]

    const response = await this.updateLead({ id: lead_id, custom_fields_values });
    return response;
  }

  async sendErrorLog({ lead_id, error }) {
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields() });

    const logField = kommoUtils.findLeadsFieldByName('GPT | LOG');
    const custom_fields_values = [
      {
        field_id: logField.id,
        values: [
          {
            value: error
          }
        ]
      }
    ]

    const response = await this.updateLead({ id: lead_id, custom_fields_values });
    return response;
  }

  async assistant({ lead_id, text, assistant_id, send_message = true } = {}) {
    styled.function('[OpenaiIntegrationServices.assistant] Enviando para o assistente GPT...');
    styled.info('[OpenaiIntegrationServices.assistant] Mensagem enviada para o assistente:', text);

    const data = {
      leadID: lead_id,
      text,
      assistant_id
    }

    const lead = await this.getLead({ id: lead_id, withParams: 'contacts' });

    const message_received = LeadUtils.findLeadField({ lead, fieldName: 'GPT | Message received' });
    if (message_received) {
      styled.info('[OpenaiIntegrationServices.assistant] Apagando última mensagem do lead no Kommo...');
      await StaticUtils.sleep(2);
      await this.updateLead({ id: lead_id, custom_fields_values: [{ field_id: message_received.field_id, values: [{ value: '' }] }] });
    }

    await new LeadThreadRepository().updateLastTimestamp(lead_id);
    const { message } = await OpenAIController.generateMessageTest({ text, leadID: lead_id, assistant_id });

    styled.success('[OpenaiIntegrationServices.assistant] Resposta recebida do assistente:', message);

    if (send_message) {
      const contact = lead.contact;
      const phoneNumber = LeadUtils.getPhoneNumber({ contact });

      this.#evolutionApi.sendMessage({ message, number: phoneNumber })
      styled.success(`[OpenaiIntegrationServices.assistant] Mensagem enviada para o lead ${lead_id} via Evolution API`);
    }

    const updated = await this.#saveAssistantMessage({ lead_id, message: StaticUtils.substituteEmojisAnswer(message) });
    return {
      generated_message: message,
      updated
    }
  }

  async prompt({ lead_id, text, send_message = false } = {}) {
    styled.function('[OpenaiIntegrationServices.prompt] Enviando prompt...');
    styled.info('[OpenaiIntegrationServices.prompt] Mensagem enviada para o prompt:', text);

    const { message } = await OpenAIController.promptMessage(text);

    styled.success('[OpenaiIntegrationServices.prompt] Resposta recebida do prompt:', message);

    if (send_message) {
      const lead = await this.getLead({ id: lead_id, withParams: 'contacts' });
      const contact = lead.contact;
      const phoneNumber = LeadUtils.getPhoneNumber({ contact });

      this.#evolutionApi.sendMessage({ message, number: phoneNumber });
      styled.success(`[OpenaiIntegrationServices.prompt] Mensagem enviada para o lead ${lead_id} via Evolution API`);
    }

    const updated = await this.#savePromptMessage({ lead_id, message });
    return {
      generated_message: message,
      updated
    }
  }

  static async assistantWithoutSending(lead_id, text, assistant_id) {
    styled.function('[OpenaiIntegrationServices.assistantWithoutSending] Enviando para o assistente GPT...');
    styled.info('[OpenaiIntegrationServices.assistantWithoutSending] Mensagem enviada para o assistente:', text);

    const data = {
      leadID: lead_id,
      text,
      assistant_id
    }

    const { message } = await OpenAIController.generateMessageTest({ text, leadID: lead_id, assistant_id });

    styled.success('[OpenaiIntegrationServices.assistantWithoutSending] Resposta recebida do assistente:', message);
    return message;
  }

  static async promptWithoutSending(text) {
    styled.function('[OpenaiIntegrationServices.promptWithoutSending] Enviando prompt...');
    styled.info('[OpenaiIntegrationServices.promptWithoutSending] Mensagem enviada para o prompt:', text);

    const { message } = await OpenAIController.promptMessage(text);

    styled.success('[OpenaiIntegrationServices.promptWithoutSending] Resposta recebida do prompt:', message);
    return message;
  }
};