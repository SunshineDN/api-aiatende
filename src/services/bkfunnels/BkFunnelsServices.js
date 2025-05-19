import BkFunnelsRepository from "../../repositories/BkFunnelsRepository.js";
import BkFunnelsUtils from "../../utils/BkFunnelsUtils.js";
import KommoUtils from "../../utils/KommoUtils.js";
import styled from "../../utils/log/styled.js";
import KommoServices from "../kommo/KommoServices.js";

export default class BkFunnelsServices {

  static async createUpdateLead(body) {
    const { code, funnelId } = body;

    styled.info(`[BkFunnelsServices.createUpdateLead] - Code: ${code} | FunnelId: ${funnelId}`);
    styled.infodir(body);

    const codeString = code.toString();
    const funnelIdString = funnelId.toString();

    const { type, value } = BkFunnelsUtils.identifyAnswer(body);

    if (type === 'not_found') {
      styled.error('Type not found');
      return { code: 404, response: { message: 'Type not found' }, created: false };
    }

    const bkFunnelsRepository = new BkFunnelsRepository();

    if (type === 'lead') {
      // const [_, created] = await bkFunnelsRepository.findOrCreate({ where: { code: codeString, funnel_id: funnelIdString } });
      const person = await bkFunnelsRepository.findOrCreate({
        where: { code: codeString, funnel_id: funnelIdString },
        update: { objects: value },
        create: { code: codeString, funnel_id: funnelIdString, objects: value },
      });

      const kommoUtils = new KommoUtils();
      const kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
      const bkLeadInfo = await bkFunnelsRepository.findByCode(codeString);

      const { objects: { name, email, phone, datanascimento, bairro }, dentista, procedimento, periodo } = bkLeadInfo;

      const lead = await kommo.listLeads({ query: kommoUtils.formatPhone(phone), first_created: true });
      let lead_res;
      if (!lead || lead?.length === 0) {
        lead_res = await kommo.createLeadBk({
          name,
          email,
          bairro,
          phone,
          datanascimento,
          dentista,
          service: procedimento,
          periodo,
          code: codeString,
          lead_status: 'DADOS CADASTRAIS'
        });
      } else {
        lead_res = await kommo.updateLeadBk({
          id: lead.id,
          name,
          email,
          bairro,
          datanascimento,
          dentista,
          service: procedimento,
          periodo,
          code: codeString,
          lead_status: 'DADOS CADASTRAIS'
        });
      }

      styled.success('BK Funnels Lead Informations has been stored');
      return { code: 200, response: { message: 'BK Funnels Lead Informations has been stored', lead_res, person } };
    }

    // const [_, created] = await bkFunnelsRepository.findOrCreate({ where: { code: codeString, funnel_id: funnelIdString } });
    // Create person without update
    const person = await bkFunnelsRepository.findOrCreate({
      where: { code: codeString, funnel_id: funnelIdString },
      update: { },
      create: { code: codeString, funnel_id: funnelIdString },
    });
    if (type === 'dentista') {
      await bkFunnelsRepository.updateByCode(codeString, { dentista: value });
      styled.success('BK Funnels Lead created and dentista has been updated');
      return { code: 200, response: { message: 'BK Funnels Lead created and dentista has been updated' } };

    } else if (type === 'procedimento') {
      await bkFunnelsRepository.updateByCode(codeString, { procedimento: value });
      styled.success('BK Funnels Lead created and procedimento has been updated');
      return { code: 200, response: { message: 'BK Funnels Lead created and procedimento has been updated' } };

    } else if (type === 'periodo') {
      await bkFunnelsRepository.updateByCode(codeString, { periodo: value });
      styled.success('BK Funnels Lead created and periodo has been updated');
      return { code: 200, response: { message: 'BK Funnels Lead created and periodo has been updated' } };

    } else if (type === 'turno') {
      await bkFunnelsRepository.updateByCode(codeString, { turno: value });

      const kommoUtils = new KommoUtils();
      const kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
      const bkLeadInfo = await bkFunnelsRepository.findByCode(codeString);

      const { objects: { name, email, phone, datanascimento, bairro }, dentista, procedimento, periodo } = bkLeadInfo;

      const lead = await kommo.listLeads({ query: kommoUtils.formatPhone(phone), first_created: true });
      let turno_res;
      if (!lead || lead?.length === 0) {
        turno_res = await kommo.createLeadBk({
          name,
          email,
          bairro,
          phone,
          datanascimento,
          dentista,
          service: procedimento,
          periodo,
          turno: value,
          code: codeString,
          lead_status: 'PRÉ-AGENDAMENTO'
        });
      } else {
        turno_res = await kommo.updateLeadBk({
          id: lead.id,
          name,
          email,
          bairro,
          datanascimento,
          dentista,
          service: procedimento,
          periodo,
          turno: value,
          code: codeString,
          lead_status: 'PRÉ-AGENDAMENTO'
        });
      }

      styled.success('BK Funnels Lead created and turno has been updated');
      return { code: 200, response: { message: 'BK Funnels Lead created and turno has been updated', turno_res, person } };

    } else if (type === 'quests') {
      const { quests } = await bkFunnelsRepository.findByCode(codeString);
      if (quests) {
        await bkFunnelsRepository.updateByCode(codeString, { quests: [...quests, value] });
      } else {
        await bkFunnelsRepository.updateByCode(codeString, { quests: [value] });
      }
      styled.success('BK Funnels Lead created and quests has been updated');
      return { code: 200, response: { message: 'BK Funnels Lead created and quests has been updated' }, person };

    } else {
      styled.error('Type not found when creating BK Funnels Lead');
      return { code: 404, response: { message: 'Type not found' }, created: false };

    }
  }
};