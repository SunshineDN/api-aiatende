import KommoServices from "../services/kommo/KommoServices.js";
import BaseRepository from "./BaseRepository.js";
import styled from "../utils/log/styled.js";
import prisma from "../prisma-client.js";

export default class LeadMessagesRepository extends BaseRepository {
  constructor() {
    super(prisma.lead_messages);
  }

  async verifySendDate({ contact_id, seconds } = {}) {
    const message = await this.findOne({ where: { contact_id: Number(contact_id) } });
    if (!message) return false;

    const messages = message.messages || [];
    const repeated_messages = messages.filter(msg => Number(msg.created_at) === Number(seconds));
    return repeated_messages.length > 0;
  }

  async verifyAndUpdate({ contact_id, message, lead_id = null } = {}) {
    await this.findOrCreate({
      where: { contact_id: Number(contact_id) },
      update: { messages: { push: message }, lead_id },
      create: {
        contact_id: Number(contact_id),
        messages: [message],
        lead_id,
      }
    });
    styled.success('[LeadMessagesRepository.verifyAndUpdate] - Mensagem registrada com sucesso!');
  }

  async updateLeadIdIfMissing({ contact_id, new_lead_id } = {}) {
    const entry = await this.findOne({ where: { contact_id: Number(contact_id), lead_id: null } });
    if (!entry) return;
    await this.update(entry.id, { lead_id: new_lead_id });
    styled.success('[LeadMessagesRepository.updateLeadIdIfMissing] - Lead ID atualizado com sucesso!');
  }

  async getMessagesHistory({ contact_id } = {}) {
    const entry = await this.findOne({ where: { contact_id: Number(contact_id) } });
    if (!entry?.messages?.length) return null;
    return entry.messages.map(msg => msg.lead_message).join('\n');
  }

  async getLastMessages({ lead_id = null, contact_id = null, limit = 3 } = {}) {
    let entry;
    if (lead_id) {
      entry = await this.findOne({ where: { lead_id: Number(lead_id) } });
      if (!entry) {
        const kommo = new KommoServices({
          auth: process.env.KOMMO_AUTH,
          url: process.env.KOMMO_URL,
        });
        const lead = await kommo.getLead({ id: lead_id, withParams: 'contacts' });
        if (!lead) return null;
        const contact = lead.contact;
        if (!contact) return null;
        entry = await this.findOne({ where: { contact_id: Number(contact.id) } });
        if (!entry) return null;
      }
    } else if (contact_id) {
      entry = await this.findOne({ where: { contact_id: Number(contact_id) } });
    } else {
      styled.error('[LeadMessagesRepository.getLastMessages] - Nenhum lead_id ou contact_id fornecido.');
      return null;
    }
    if (!entry?.messages?.length) return null;
    return entry.messages.slice(-limit).map(msg => msg.lead_message).join('\n');
  }

  async getRecentMessages({ lead_id = null, contact_id = null } = {}) {
    let entry;
    if (lead_id) {
      entry = await this.findOne({ where: { lead_id: Number(lead_id) } });
      if (!entry) {
        const kommo = new KommoServices({
          auth: process.env.KOMMO_AUTH,
          url: process.env.KOMMO_URL,
        });
        const lead = await kommo.getLead({ id: lead_id, withParams: 'contacts' });
        if (!lead) return null;
        const contact = lead.contact;
        if (!contact) return null;
        entry = await this.findOne({ where: { contact_id: Number(contact.id) } });
        if (!entry) return null;
      }
    } else if (contact_id) {
      entry = await this.findOne({ where: { contact_id: Number(contact_id) } });
    } else {
      styled.error('[LeadMessagesRepository.getRecentMessages] - Nenhum lead_id ou contact_id fornecido.');
      return null;
    }
    if (!entry?.messages?.length) return null;

    const seconds = 20;
    const now = new Date();
    const recentMessages = entry.messages.filter(msg => {
      const msgDate = new Date(Number(msg.created_at) * 1000);
      return (now - msgDate) <= (seconds * 1000);
    });
    return recentMessages.map(msg => msg.lead_message).join('\n') || null;
  }

  async getLastAndRecentMessages({ lead_id = null, contact_id = null, limit = 3 } = {}) {
    let entry;
    if (lead_id) {
      entry = await this.findOne({ where: { lead_id: Number(lead_id) } });
      if (!entry) {
        const kommo = new KommoServices({
          auth: process.env.KOMMO_AUTH,
          url: process.env.KOMMO_URL,
        });
        const lead = await kommo.getLead({ id: lead_id, withParams: 'contacts' });
        if (!lead) return null;
        const contact = lead.contact;
        if (!contact) return null;
        entry = await this.findOne({ where: { contact_id: Number(contact.id) } });
        if (!entry) return null;
      }
    } else if (contact_id) {
      entry = await this.findOne({ where: { contact_id: Number(contact_id) } });
    } else {
      styled.error('[LeadMessagesRepository.getLastAndRecentMessages] - Nenhum lead_id ou contact_id fornecido.');
      return null;
    }
    if (!entry?.messages?.length) return null;

    const messages = entry.messages;
    const seconds = 20;
    const now = new Date();

    const recent = messages.filter(msg => {
      const msgDate = new Date(Number(msg.created_at) * 1000);
      return (now - msgDate) <= (seconds * 1000);
    });

    return {
      last_messages: messages.slice(-limit).map(msg => msg.lead_message).join('\n'),
      recent_messages: recent.map(msg => msg.lead_message).join('\n') || null
    };
  }

  async getFirstMessageOrigin({ contact_id } = {}) {
    const entry = await this.findOne({ where: { contact_id: Number(contact_id) } });
    if (!entry?.messages?.length) return null;
    const origin = entry.messages[0].origin;

    switch (origin) {
      case 'com.amocrm.amocrmwa': return 'WhatsApp Web';
      case 'instagram_business': return 'Instagram Direct';
      case 'waba': return 'WhatsApp API';
      default: return origin;
    }
  }

  async setBoolSendMessage({ contact_id = null, lead_id = null } = {}) {
    let entry;
    if (lead_id) {
      entry = await this.findOne({ where: { lead_id: Number(lead_id) } });
      if (!entry) {
        const kommo = new KommoServices({
          auth: process.env.KOMMO_AUTH,
          url: process.env.KOMMO_URL,
        });
        const lead = await kommo.getLead({ id: lead_id, withParams: 'contacts' });
        if (!lead) return null;
        const contact = lead.contact;
        if (!contact) return null;
        entry = await this.findOne({ where: { contact_id: Number(contact.id) } });
        if (!entry) return null;
      }
    } else if (contact_id) {
      entry = await this.findOne({ where: { contact_id: Number(contact_id) } });
    } else {
      styled.error('[LeadMessagesRepository.setBoolSendMessage] - Nenhum lead_id ou contact_id fornecido.');
      return null;
    }
    if (!entry?.messages?.length) return null;

    const origin = entry.messages.at(-1)?.origin;
    if (!origin) return null;

    return origin === 'com.amocrm.amocrmwa';
  }

  async clearMessages({ contact_id } = {}) {
    const entry = await this.findOne({ where: { contact_id: Number(contact_id) } });
    if (!entry?.messages?.length) return null;

    await this.update(entry.id, { messages: [] });
    styled.success('[LeadMessagesRepository.clearMessages] - Mensagens limpas com sucesso!');
  }

  async getUpdatedAt({ contact_id } = {}) {
    const entry = await this.findOne({ where: { contact_id: Number(contact_id) } });
    if (!entry?.messages?.length) return null;

    const last = entry.messages.at(-1);
    return last?.updated_at || last?.created_at || null;
  }
}
