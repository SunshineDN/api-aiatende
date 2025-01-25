import BaseRepository from "./BaseRepository.js";
import LeadThread from "../models/LeadThread.js";

export default class LeadThreadRepository extends BaseRepository {
  constructor() {
    super(LeadThread);
  }

  async updateLastTimestamp(lead_id) {
    await this.model.update({ lastTimestamp: new Date() }, { where: { leadID: Number(lead_id) } });
    return;
  }

  async getLastTimestamp(lead_id) {
    const leadThread = await this.model.findOne({ where: { leadID: Number(lead_id) } });
    return leadThread.lastTimestamp;
  }
}