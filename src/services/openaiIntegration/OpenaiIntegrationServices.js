import styled from '../../utils/log/styled.js';
import OpenAIController from '../../controllers/OpenAIController.js';
import KommoUtils from '../../utils/KommoUtils.js';
import KommoServices from '../kommo/KommoServices.js';
import LeadThreadRepository from '../../repositories/LeadThreadRepository.js';
import LeadUtils from '../../utils/LeadUtils.js';
import StaticUtils from '../../utils/StaticUtils.js';

export default class OpenaiIntegrationServices extends KommoServices {
  constructor({ auth, url }) {
    super({ auth, url });
  }

  async #sendMessage({ lead_id, message }) {
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

  async assistant(lead_id, text, assistant_id) {
    styled.function('[OpenaiIntegrationServices.assistant] Enviando para o assistente GPT...');
    styled.info('[OpenaiIntegrationServices.assistant] Mensagem enviada para o assistente:', text);

    const data = {
      leadID: lead_id,
      text,
      assistant_id
    }

    const lead = await this.getLead({ id: lead_id });
    const message_received = LeadUtils.findLeadField({ lead, fieldName: 'GPT | Message received' });
    if (message_received) {
      StaticUtils.sleep(2);
      await this.updateLead({ id: lead_id, custom_fields_values: [{ field_id: message_received.field_id, values: [{ value: '' }] }] });
    }

    await new LeadThreadRepository().updateLastTimestamp(lead_id);
    const { message } = await OpenAIController.generateMessage(data);

    styled.success('[OpenaiIntegrationServices.assistant] Resposta recebida do assistente:', message);
    const updated = await this.#sendMessage({ lead_id, message: StaticUtils.substituteEmojisAnswer(message) });
    return {
      generated_message: message,
      updated
    }
  }

  async prompt(lead_id, text) {
    styled.function('[OpenaiIntegrationServices.prompt] Enviando prompt...');
    styled.info('[OpenaiIntegrationServices.prompt] Mensagem enviada para o prompt:', text);

    const { message } = await OpenAIController.promptMessage(text);

    styled.success('[OpenaiIntegrationServices.prompt] Resposta recebida do prompt:', message);

    const updated = await this.#sendMessage({ lead_id, message });
    return {
      generated_message: message,
      updated
    }
  }
};