import BaseRepository from "./BaseRepository.js";
import models from "../models/index.js";

export default class BkFunnelsRepository extends BaseRepository {
  constructor() {
    super(models.BkFunnel);
  }

  async findByCode(code) {
    return await this.findById(code);
  }

  async updateByCode(code, data) {
    return await this.model.update(data, { where: { code } });
  }
}