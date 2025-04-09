import BaseRepository from "./BaseRepository.js";
import LeadThreadRepository from "./LeadThreadRepository.js";
import LeadMessages from "../models/lead_messages.js";
import styled from "../utils/log/styled.js";

export default class LeadMessagesRepository extends BaseRepository {
  constructor() {
    super(LeadMessages);
  }

  async verifySendDate(lead_id, seconds) {
    const message = await this.findOne({ where: { id: Number(lead_id) } });
    if (!message) return false;

    const messages = message.messages;
    if (!messages || !messages.length) return false;

    const repeated_messages = messages.filter((msg) => {
      return (Number(msg.created_at) === Number(seconds));
    });

    return (repeated_messages.length > 0);
  }

  async verifyAndUpdate(lead_id, message) {
    const [create, _] = await this.findOrCreate({ where: { id: Number(lead_id) } });

    if (create.messages) {
      await this.update(Number(lead_id), { messages: [...create.messages, message] });
      styled.success('[LeadMessagesRepository.verifyAndUpdate] - Mensagem adicionada ao Lead EXISTENTE');
    } else {
      await this.update(Number(lead_id), { messages: [message] });
      styled.success('[LeadMessagesRepository.verifyAndUpdate] - Mensagem adicionada ao Lead NOVO');
    }

    return;
  }

  async getLastMessages(lead_id, limit = 3) {
    const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
    if (!lead_message?.messages?.length) return null;

    const messages = lead_message.messages;

    return messages.slice(-limit).map(msg => msg.lead_message).join('\n');
  }

  async getRecentMessages(lead_id) {
    const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
    if (!lead_message?.messages?.length) return null;

    const last_timestamp = await new LeadThreadRepository().getLastTimestamp(Number(lead_id));
    last_timestamp?.setMilliseconds(last_timestamp.getMilliseconds() - 1000);

    const messages = lead_message.messages;
    const recent_messages = [];

    for (const msg of messages) {
      const created_at = new Date(Number(msg.created_at) * 1000);
      if (created_at > last_timestamp) {
        recent_messages.push(msg.lead_message);
      }
    }

    return recent_messages.join('\n') || null
  }

  async getLastAndRecentMessages(lead_id, limit = 3) {
    const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
    if (!lead_message?.messages?.length) return null;

    const last_timestamp = await new LeadThreadRepository().getLastTimestamp(Number(lead_id));
    last_timestamp?.setMilliseconds(last_timestamp.getMilliseconds() - 1000);

    const messages = lead_message.messages;
    const recent_messages = [];

    for (const msg of messages) {
      const created_at = new Date(Number(msg.created_at) * 1000);
      if (created_at > last_timestamp) {
        recent_messages.push(msg.lead_message);
      }
    }

    return {
      last_messages: messages.slice(-limit).map(msg => msg.lead_message).join('\n'),
      recent_messages: recent_messages.join('\n') || null
    };
  }

  async getFirstMessageOrigin(lead_id) {
    const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
    if (!lead_message?.messages?.length) return null;

    const origin = lead_message.messages[0].origin;

    switch (origin) {
      case 'com.amocrm.amocrmwa':
        return 'WhatsApp Web';
      case 'instagram_business':
        return 'Instagram Direct';
      case 'waba':
        return 'WhatsApp API';
      default:
        return origin;
    }
  }

  async clearMessages(lead_id) {
    const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
    if (!lead_message?.messages?.length) return null;

    await this.update(Number(lead_id), { messages: [] });
    styled.success('[LeadMessagesRepository.clearMessages] - Mensagens limpas com sucesso!');
  }
}