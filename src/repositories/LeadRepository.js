import BaseRepository from "./BaseRepository.js";
import prisma from "../prisma-client.js";
import styled from "../utils/log/styled.js";

export default class LeadRepository extends BaseRepository {
  constructor() {
    super(prisma.leads);
  }

  async findOrCreateLead({ lead_id, contact_id }) {
    const lead = await this.findOrCreate({
      where: { lead_id: Number(lead_id) },
      update: { contact_id: Number(contact_id) },
      create: { lead_id: Number(lead_id), contact_id: Number(contact_id) },
    });

    styled.success('[LeadRepository.findOrCreateLead] - Lead encontrado ou criado com sucesso!');
    return lead;
  }

  async findCreateAndUpdate(id, obj) {
    const lead = await this.findOrCreate({
      where: { lead_id: Number(id) },
      update: { data: obj },
      create: { lead_id: Number(id), data: obj },
    });

    styled.success('[LeadRepository.findCreateAndUpdate] - Lead encontrado ou criado com sucesso!');
    return;
  }
}