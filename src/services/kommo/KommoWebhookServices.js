import KommoUtils from "../../utils/KommoUtils.js";
import LeadUtils from "../../utils/LeadUtils.js";
import styled from "../../utils/log/styledLog.js";
import StaticUtils from "../../utils/StaticUtils.js";
import OpenAIServices from "../gpt/OpenAIServices.js";
import KommoServices from "./KommoServices.js";

export default class KommoWebhookServices extends KommoServices {
  constructor() {
    super({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
  }

  async createLead(id, { calendar = false, created_at = false } = {}) {
    styled.function('[KommoWebhookServices.createLead]');

    const lead = await this.getLead({ id });
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields() });
    const calendario = LeadUtils.findLeadField({ lead, fieldName: 'Calendário', value: true });
    const criacao = LeadUtils.findLeadField({ lead, fieldName: 'Data de Criação', value: true });

    const custom_fields_values = [];

    if (calendar) {
      if (!calendario) {
        const calendarField = kommoUtils.findLeadsFieldByName('Calendário');
        const calendarLink = StaticUtils.calendarLink(id);

        custom_fields_values.push({
          field_id: calendarField.id,
          values: [
            {
              value: calendarLink
            }
          ]
        });
      } else {
        styled.warning('[KommoServices.createLead] - Calendário já existe no Lead');
      }
    }

    if (created_at) {
      if (!criacao) {
        const createdAtField = kommoUtils.findLeadsFieldByName('Data de Criação');
        let createdAt = lead?.created_at;
        if (!createdAt) {
          createdAt = Math.round(new Date().getTime() / 1000);
        }
        custom_fields_values.push({
          field_id: createdAtField.id,
          values: [
            {
              value: createdAt
            }
          ]
        });
      } else {
        styled.warning('[KommoServices.createLead] - Data de Criação já existe no Lead');
      }
    }

    const res = await this.updateLead({ id, custom_fields_values });
    styled.success('[KommoServices.createLead] - Webhook Geral de criação de leads executado');
    return { code: 200, response: res };
  }

  async messageReceived({ lead_id, attachment = {}, text = '' } = {}) {
    styled.function('[KommoWebhookServices.messageReceived]');
    const openaiServices = new OpenAIServices();
    let novaMensagem = text;

    if (Object.keys(attachment).length > 0) {
      if (attachment?.type === 'voice' || attachment?.type === 'audio') {
        const extension = attachment?.file_name.split('.').pop();
        const file_name = `${lead_id}.${extension}`;
        text = await openaiServices.transcribeAudio(attachment?.link, file_name);
        
      } else {
        text = '[anexo]';
      }
    }

    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields() });
    const lead = await this.getLead({ id: lead_id });

    const lastMessages = kommoUtils.findLeadsFieldByName('GPT | Last messages');

    const leadMessage = LeadUtils.findLeadField({ lead, fieldName: 'GPT | Last messages', value: true });
    const message = leadMessage ? leadMessage.split('\n') : [];

    message.push(novaMensagem);

    if (message.length > 3) {
      message.shift();
    }

    message.join('\n');

    const custom_fields_values = [
      {
        field_id: lastMessages.id,
        values: [
          {
            value: message
          }
        ]
      },
    ]

    const res = await this.updateLead({ id: lead_id, custom_fields_values });
    styled.info('Preenchido mensagem do lead:', message);
    return { code: 200, response: res };
  }
}