import BaseRepository from "./BaseRepository.js";
import models from "../models/index.js";

export default class LeadThreadRepository extends BaseRepository {
  constructor() {
    super(models.LeadThread);
  }

  async updateLastTimestamp(lead_id) {
    await this.model.update({ last_timestamp: new Date() }, { where: { lead_id: Number(lead_id) } });
    return;
  }

  async getLastTimestamp(lead_id) {
    const [create, _] = await this.findOrCreate({ where: { lead_id: Number(lead_id) } });
    return create?.last_timestamp || null;
  }

  async findThreads(lead_id) {
    return await this.findOne({ where: { lead_id: Number(lead_id) } });
  }

  async deleteThreads(lead_id) {
    await this.delete({ where: { lead_id: Number(lead_id) } });
  }

  async updateThreads(lead_id, data) {
    await this.model.update(data, { where: { lead_id: Number(lead_id) } });
  }
}