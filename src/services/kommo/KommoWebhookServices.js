import KommoUtils from "../../utils/KommoUtils.js";
import LeadUtils from "../../utils/LeadUtils.js";
import styled from "../../utils/log/styled.js";
import StaticUtils from "../../utils/StaticUtils.js";
import OpenAIServices from "../gpt/OpenAIServices.js";
import KommoServices from "./KommoServices.js";
import KommoWebhookUtils from "../../utils/KommoWebhookUtils.js";
import LeadMessagesRepository from "../../repositories/LeadMessagesRepository.js";
import MarketingTrackingRepository from "../../repositories/MarketingTrackingRepository.js";
import WppServices from "../wpp/WppServices.js";

export default class KommoWebhookServices extends KommoServices {
  constructor({ auth, url }) {
    super({ auth, url });
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
        styled.warning('[KommoWebhookServices.createLead] - Calendário já existe no Lead');
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
        styled.warning('[KommoWebhookServices.createLead] - Data de Criação já existe no Lead');
      }
    }

    const res = await this.updateLead({ id, custom_fields_values });
    styled.success('[KommoWebhookServices.createLead] - Webhook Geral de criação de leads executado');
    return { code: 200, response: res };
  }

  async messageReceived(obj) {
    //{ lead_id, attachment = {}, text = '' } = {}
    styled.function('[KommoWebhookServices.messageReceived]');
    const { lead_id } = obj;
    const { attachment = {}, text = '' } = obj.message;

    const haveHash = KommoWebhookUtils.handleEncounterHash(text);

    if (haveHash) {
      styled.info('[KommoWebhookServices.messageReceived] - Mensagem contém hash, buscando no banco de dados...');

      const marketingTrackingRepository = new MarketingTrackingRepository();
      const utms = await marketingTrackingRepository.findOne({ where: { hash: haveHash } });

      if (utms) {
        styled.success('[KommoWebhookServices.messageReceived] - Hash encontrada, processando...');

        const wppServices = new WppServices();
        const custom_fields = await wppServices.handleCustomFields({ utms });
        await this.updateLead({ id: lead_id, custom_fields_values: custom_fields });
        styled.success('[KommoWebhookServices.messageReceived] - Campos personalizados atualizados com sucesso.');
      } else {
        styled.warning('[KommoWebhookServices.messageReceived] - Nenhuma hash identificada corretamente na mensagem.');
      }
    }

    const leadMessageRepository = new LeadMessagesRepository();

    const send_at = obj?.message?.created_at;
    const repeated = await leadMessageRepository.verifySendDate(lead_id, send_at);

    if (repeated) {
      styled.warning('[KommoWebhookServices.messageReceived] - Mensagem repetida');
      return { code: 200, response: { repeated: true } };
    }

    const openaiServices = new OpenAIServices();
    obj.message.lead_message = StaticUtils.isUrl(text) ? '[url]' : StaticUtils.substituirEmojis(text);

    if (Object.keys(attachment).length > 0) {
      if (attachment?.type === 'voice' || attachment?.type === 'audio') {
        const extension = attachment?.file_name.split('.').pop();
        const file_name = `${lead_id}.${extension}`;
        obj.message.lead_message = await openaiServices.transcribeAudio(attachment?.link, file_name);

      } else {
        obj.message.lead_message = '[anexo]';

      }
    }

    await leadMessageRepository.verifyAndUpdate(lead_id, obj.message);
    // const lead_messages = await leadMessageRepository.getLastMessages(lead_id);
    const { last_messages, recent_messages } = await leadMessageRepository.getLastAndRecentMessages(lead_id);

    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields() });
    const lastMessages = kommoUtils.findLeadsFieldByName('GPT | Last messages');
    const message_received = kommoUtils.findLeadsFieldByName('GPT | Message received');

    const custom_fields_values = [
      {
        field_id: lastMessages.id,
        values: [
          {
            value: last_messages
          }
        ]
      },
      {
        field_id: message_received.id,
        values: [
          {
            value: recent_messages
          }
        ]
      }
    ];

    const res = await this.updateLead({ id: lead_id, custom_fields_values });
    styled.success('[KommoWebhookServices.messageReceived] - Mensagens recentes: ', recent_messages);
    styled.success('[KommoWebhookServices.messageReceived] - Últimas mensagens: ', last_messages);
    return { code: 200, response: res };
  }
}
