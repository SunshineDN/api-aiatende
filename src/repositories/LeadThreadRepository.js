import BaseRepository from "./BaseRepository.js";
import models from "../models/index.js";
import prisma from "../prisma-client.js";

export default class LeadThreadRepository extends BaseRepository {
  constructor() {
    super(prisma.lead_threads);
  }

  async updateLastTimestamp(lead_id) {
    // await this.model.update({ last_timestamp: new Date() }, { where: { lead_id: Number(lead_id) } });
    await this.model.update({ where: { lead_id: Number(lead_id) }, data: { last_timestamp: new Date() } });
    return;
  }

  async updateLastEvent(lead_id) {
    await this.model.update({ where: { lead_id: Number(lead_id) }, data: { updated_at: new Date() } });
  }

  async getLastTimestamp(lead_id) {
    const upsertLastTimestamp = await this.findOrCreate({
      create: { lead_id: Number(lead_id), last_timestamp: new Date(), created_at: new Date(), updated_at: new Date() },
      update: { last_timestamp: new Date(), updated_at: new Date() },
      where: { lead_id: Number(lead_id) },
    });
    return upsertLastTimestamp?.last_timestamp || null;
  }

  async findThreads(lead_id) {
    // return await this.findOne({ where: { lead_id: Number(lead_id) } });
    return await this.model.findUnique({ where: { lead_id: Number(lead_id) } });
  }

  async deleteThreads(lead_id) {
    // await this.delete({ where: { lead_id: Number(lead_id) } });
    await this.model.delete({ where: { lead_id: Number(lead_id) } });
  }

  async updateThreads(lead_id, data) {
    // await this.model.update(data, { where: { lead_id: Number(lead_id) } });
    await this.model.update({ where: { lead_id: Number(lead_id) }, data });
  }
}