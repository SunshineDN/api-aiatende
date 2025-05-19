import BaseRepository from "./BaseRepository.js";
import models from "../models/index.js";
import prisma from "../prisma-client.js";
export default class MarketingTrackingRepository extends BaseRepository {
  constructor() {
    super(prisma.marketing_tracking);
  }

  async updateByClientId(gclientid, data) {
    // return await this.model.update(data, { where: { gclientid } });
    return await this.model.update({
      where: {
        gclientid,
      },
      data,
    });
  }
}