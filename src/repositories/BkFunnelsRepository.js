import BaseRepository from "./BaseRepository.js";
import BkFunnels from "../models/bk_funnels.js";

export default class BkFunnelsRepository extends BaseRepository {
  constructor() {
    super(BkFunnels);
  }

  async findByCode(code) {
    return await this.findById(code);
  }

  async updateByCode(code, data) {
    return await this.model.update(data, { where: { code } });
  }
}