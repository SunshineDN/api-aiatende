import styled from '../../utils/log/styledLog.js';
import OpenAIController from '../../controllers/OpenAIController.js';
import KommoUtils from '../../utils/KommoUtils.js';
import KommoServices from '../kommo/KommoServices.js';

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
      leadId: lead_id,
      text,
      assistantId: assistant_id
    }

    const { message } = await OpenAIController.generateMessage(data);

    styled.success('[OpenaiIntegrationServices.assistant] Resposta recebida do assistente:', message);

    return await this.#sendMessage({ lead_id, message });
  }

  async prompt(lead_id, text) {
    styled.function('[OpenaiIntegrationServices.prompt] Enviando prompt...');
    styled.info('[OpenaiIntegrationServices.prompt] Mensagem enviada para o prompt:', text);

    const { message } = await OpenAIController.promptMessage(text);

    styled.success('[OpenaiIntegrationServices.prompt] Resposta recebida do prompt:', message);

    return await this.#sendMessage({ lead_id, message });
  }
};