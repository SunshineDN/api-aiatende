import BaseRepository from "./BaseRepository.js";
import models from "../models/index.js";

export default class LeadRepository extends BaseRepository {
  constructor() {
    super(models.Lead);
  }

  async findCreateAndUpdate(id, obj) {
    const [lead, created] = await this.findOrCreate({
      where: { lead_id: id },
      defaults: {
        data: obj
      },
    });

    if (!created) {
      await lead.update(obj);
    }

    return;
  }
}