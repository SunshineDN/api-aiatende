import KommoUtils from "../../utils/KommoUtils";
import LeadUtils from "../../utils/LeadUtils";
import styled from "../../utils/log/styledLog";
import KommoServices from "./KommoServices";

export default class KommoWebhookServices extends KommoServices {
  constructor() {
    super({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
  }

  async messageReceived(payload) {
    styled.function('[KommoWebhookServices.messageReceived]');

    // const processarMensagem = 

    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields() });
    const lead = await this.getLead({ id: payload?.lead_id });

    const lastMessages = kommoUtils.findLeadsFieldByName('GPT | Last messages');

    const leadMessage = LeadUtils.findLeadField({ lead, fieldName: 'GPT | Last messages', value: true });
    const message = leadMessage ? leadMessage.split('\n') : [];



    if (message_obj.type !== 'voice') {
      str = message_obj.text_audio.replace(/\+/g, ' ');
    } else {
      str = message_obj.text_audio;
    }

    if (leadMessage_isFilled?.values[0]?.value) {
      const messageSplit = leadMessage_isFilled?.values[0]?.value.split('\n');
      const sortedMessage = messageSplit?.reverse();
      const filterMessage = sortedMessage.filter((_, index) => index < 3);
      message = `${filterMessage.reverse().join('\n')}
${str}`;
      const filled_message = message.split('\n');
      const unique_messages = [...new Set(filled_message)];
      message = unique_messages.join('\n');
    } else {
      message = str;
    }

    const data = {
      'custom_fields_values': [
        {
          'field_id': lastMessages.id,
          'values': [
            {
              'value': message
            }
          ]
        },
      ],
    };

    await UpdateLead(payload, data, access_token);

    styled.info('Preenchido mensagem do lead:', message);
  }
}