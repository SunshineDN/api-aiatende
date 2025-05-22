import BaseRepository from "./BaseRepository.js";
import models from "../models/index.js";
import prisma from "../prisma-client.js";
import styled from "../utils/log/styled.js";

export default class LeadRepository extends BaseRepository {
  constructor() {
    super(prisma.leads);
  }

  async findCreateAndUpdate(id, obj) {
    // const [lead, created] = await this.findOrCreate({
    //   where: { lead_id: id },
    //   defaults: {
    //     data: obj
    //   },
    // });

    // if (!created) {
    //   await lead.update(obj);
    // }

    const lead = await this.findOrCreate({
      where: { lead_id: Number(id) },
      update: { data: obj },
      create: { lead_id: Number(id), data: obj },
    });

    styled.success('[LeadRepository.findCreateAndUpdate] - Lead encontrado ou criado com sucesso!');
    styled.successdir(lead);

    return;
  }
}