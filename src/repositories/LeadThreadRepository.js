import BaseRepository from "./BaseRepository.js";
import LeadThread from "../models/LeadThread.js";

export default class LeadThreadRepository extends BaseRepository {
  constructor() {
    super(LeadThread);
  }

  // Atualiza o campo updatedAt do LeadThread com a data atual e fuso horário do Brasil
  async updateLastTimestamp(lead_id) {
    return await this.model.update({ lastTimestamp: new Date() }, { where: { leadID: Number(lead_id) } });
  }

  // Retorna a data de atualização do LeadThread
  async getLastTimestamp(lead_id) {
    const leadThread = await this.model.findOne({ where: { leadID: Number(lead_id) } });
    return leadThread?.updatedAt;
  }
}