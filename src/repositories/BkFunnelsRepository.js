import BaseRepository from "./BaseRepository.js";
import prisma from "../prisma-client.js";

export default class BkFunnelsRepository extends BaseRepository {
  constructor() {
    super(prisma.bk_funnels);
  }

  async findByCode(code) {
    return await this.findById(code);
  }

  async updateByCode(code, data) {
    // return await this.model.update(data, { where: { code } });
    return await this.model.update({
      where: {
        code,
      },
      data,
    });
  }
}