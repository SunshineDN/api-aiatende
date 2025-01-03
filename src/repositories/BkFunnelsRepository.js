import BaseRepository from "./BaseRepository";
import BkFunnels from "../models/BkFunnels";

export default class BkFunnelsRepository extends BaseRepository {
  constructor() {
    super(BkFunnels);
  }

  async findByCode(code) {
    return await this.findById(code);
  }

  async updateByCode(code, data) {
    return await this.update(code, data);
  }
}