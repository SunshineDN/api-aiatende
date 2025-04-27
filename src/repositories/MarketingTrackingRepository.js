import BaseRepository from "./BaseRepository.js";
import models from "../models/index.js";

export default class MarketingTrackingRepository extends BaseRepository {
  constructor() {
    super(models.MarketingTracking);
  }

  async updateByClientId(client_id, data) {
    return await this.model.update(data, { where: { client_id } });
  }
}