import BaseRepository from "./BaseRepository.js";
import models from "../models/index.js";
import prisma from "../prisma-client.js";
import LeadThreadRepository from "./LeadThreadRepository.js";
import styled from "../utils/log/styled.js";

export default class LeadMessagesRepository extends BaseRepository {
  constructor() {
    super(prisma.lead_messages);
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
    await this.findOrCreate({
      where: { id: Number(lead_id) },
      update: { messages: { push: message } },
      create: { id: Number(lead_id), messages: [message] },
    });
    styled.success('[LeadMessagesRepository.verifyAndUpdate] - Lead encontrado ou criado com sucesso!');
    return;
  }

  async getMessagesHistory(lead_id) {
    const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
    if (!lead_message?.messages?.length) {
      styled.warning('[LeadMessagesRepository.getMessagesHistory] - Nenhuma mensagem encontrada no histórico');
      return null;
    };

    const messages = lead_message.messages;

    return messages.map(msg => msg.lead_message).join('\n');
  }

  async getLastMessages(lead_id, limit = 3) {
    const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
    if (!lead_message?.messages?.length) {
      styled.warning('[LeadMessagesRepository.getLastMessages] - Nenhuma última mensagem encontrada');
      return null;
    };

    const messages = lead_message.messages;

    return messages.slice(-limit).map(msg => msg.lead_message).join('\n');
  }

  async getRecentMessages(lead_id) {
    const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
    if (!lead_message?.messages?.length) {
      styled.warning('[LeadMessagesRepository.getRecentMessages] - Nenhuma mensagem recente encontrada');
      return null;
    }

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

    // const last_timestamp = await new LeadThreadRepository().getLastTimestamp(Number(lead_id));
    // last_timestamp?.setMilliseconds(last_timestamp.getMilliseconds() - 1000);

    // const updated_at = lead_message.updated_at || lead_message.created_at;
    // updated_at.setMilliseconds(updated_at.getMilliseconds() - 1000);

    const messages = lead_message.messages;
    const recent_messages = [];
    const seconds = 15; // Número de segundos para considerar recente, pode ser alterado conforme necessário

    for (const msg of messages) {
      const created_at = new Date(Number(msg.created_at) * 1000);
      const date_now = new Date();

      // Verificar se a mensagem foi criada a menos de X segundos
      const is_recent = (date_now - created_at) <= (seconds * 1000);
      if (is_recent) {
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

  async setBoolSendMessage(lead_id) {
    const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
    if (!lead_message?.messages?.length) return null;

    const origin = lead_message.messages[lead_message.messages.length - 1].origin;

    if (!origin) return null;

    if (origin === 'com.amocrm.amocrmwa') {
      return true;
    } else if (origin === 'instagram_business') {
      return false;
    } else if (origin === 'waba') {
      return false;
    }

    return false;
  }

  async clearMessages(lead_id) {
    const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
    if (!lead_message?.messages?.length) return null;

    await this.update(Number(lead_id), { messages: [] });
    styled.success('[LeadMessagesRepository.clearMessages] - Mensagens limpas com sucesso!');
  }

  async getUpdatedAt(lead_id) {
    const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
    if (!lead_message?.messages?.length) return null;

    const last_message = lead_message.messages[lead_message.messages.length - 1];
    if (!last_message || !last_message.created_at) return null;

    return last_message.updated_at || last_message.created_at;
  }
}