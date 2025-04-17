import LeadMessagesRepository from "../../repositories/LeadMessagesRepository.js";
import LeadThreadRepository from "../../repositories/LeadThreadRepository.js";
import BkFunnelsRepository from "../../repositories/BkFunnelsRepository.js";

export default class AdminServices {
  #lead_id;
  
  constructor(lead_id) {
    this.#lead_id = lead_id;
  }

  // Get all messages from a lead
  async executeGetLeadMessages(quantity = 0) {
    const leadMessagesRepository = new LeadMessagesRepository();
    const lead_messages = await leadMessagesRepository.findById(this.#lead_id);
    if (quantity > 0) lead_messages.messages = lead_messages.messages.slice(-quantity);
    return lead_messages;
  }

  async executeDeleteLeadMessages() {
    const leadMessagesRepository = new LeadMessagesRepository();
    return await leadMessagesRepository.delete({ where: { id: Number(this.#lead_id) } });
  }

  // Get all threads from a lead
  async executeGetLeadThreads() {
    const leadThreadRepository = new LeadThreadRepository();
    return await leadThreadRepository.findById(this.#lead_id);
  }

  async executeDeleteLeadThreads() {
    const leadThreadRepository = new LeadThreadRepository();
    return await leadThreadRepository.delete({ where: { leadID: Number(this.#lead_id) } });
  }

  // Get all bk funnels from a lead
  async executeGetLeadBkFunnels() {
    const bkFunnelsRepository = new BkFunnelsRepository();
    return await bkFunnelsRepository.findById(this.#lead_id);
  }

  async executeDeleteLeadBkFunnels() {
    const bkFunnelsRepository = new BkFunnelsRepository();
    return await bkFunnelsRepository.delete({ where: { code: this.#lead_id } });
  }
}