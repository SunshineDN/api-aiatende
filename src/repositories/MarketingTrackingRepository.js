import BaseRepository from "./BaseRepository.js";
import marketing_tracking from "../models/marketing_tracking.js";


export default class MarketingTrackingRepository extends BaseRepository {
  constructor() {
    super(marketing_tracking);
  }

  async updateByClientId(client_id, data) {
    return await this.model.update(data, { where: { client_id } });
  }
}