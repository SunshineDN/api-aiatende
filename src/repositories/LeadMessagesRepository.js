import BaseRepository from "./BaseRepository.js";
import LeadThreadRepository from "./LeadThreadRepository.js";
import LeadMessages from "../models/LeadMessages.js";
import styled from "../utils/log/styledLog.js";

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

  async getLastAndRecentMessages(lead_id) {
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
      last_messages: messages.slice(-3).map(msg => msg.lead_message).join('\n'),
      recent_messages: recent_messages.join('\n') || null
    };
  }

  // async getLastMessages(lead_id, limit = 3) {
  //   const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
  //   if (!lead_message) return '';

  //   const lead_messages = lead_message.messages;
  //   if (!lead_messages || !lead_messages.length) return '';

  //   const messages = lead_messages.slice(-limit).map(msg => msg.lead_message);
  //   return messages.join('\n');
  // }

  // async getRecentMessages(lead_id) {
  //   const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
  //   if (!lead_message) return '';

  //   const lead_messages = lead_message.messages;
  //   if (!lead_messages || !lead_messages.length) return '';

  //   const last_timestamp = await new LeadThreadRepository().getLastTimestamp(lead_id);

  //   let messages = lead_messages;
  //   if (last_timestamp) {
  //     messages = lead_messages.filter(msg => new Date(Number(msg.created_at) * 1000) > last_timestamp);
  //   }

  //   if (!messages.length) return '';

  //   return messages.map(msg => msg.lead_message).join('\n');
  // }

  // async getLastAndRecentMessages(lead_id) {
  //   const lead_message = await this.findOne({ where: { id: Number(lead_id) } });
  //   if (!lead_message) return null;

  //   const lead_messages = lead_message.messages;
  //   if (!lead_messages || !lead_messages.length) return null;

  //   const last_timestamp = await new LeadThreadRepository().getLastTimestamp(Number(lead_id));
  //   const messages = lead_messages.filter(msg => new Date(Number(msg.created_at) * 1000) > last_timestamp);
  //   if (!messages.length) return null;

  //   return {
  //     last_messages: lead_messages.slice(-3).map(msg => msg.lead_message).join('\n'),
  //     recent_messages: messages.map(msg => msg.lead_message).join('\n')
  //   };
  // }
}