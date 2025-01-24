import BkFunnelsRepository from "../../repositories/BkFunnelsRepository.js";
import BkFunnelsUtils from "../../utils/BkFunnelsUtils.js";
import KommoUtils from "../../utils/KommoUtils.js";
import styled from "../../utils/log/styledLog.js";
import KommoServices from "../kommo/KommoServices.js";

export default class BkFunnelsServices {

  static async createUpdateLead(body) {
    const { code, funnelId } = body;
    const codeString = code.toString();
    const funnelIdString = funnelId.toString();

    const { type, value } = BkFunnelsUtils.identifyAnswer(body);

    if (type === 'not_found') {
      styled.error('Type not found');
      return { code: 404, response: { message: 'Type not found' }, created: false };
    }

    const bkFunnelsRepository = new BkFunnelsRepository();

    if (type === 'lead') {
      const [_, created] = await bkFunnelsRepository.findOrCreate({ where: { code: codeString, funnelId: funnelIdString } });

      await bkFunnelsRepository.updateByCode(codeString, { objects: value });
      styled.success('BK Funnels Lead Informations has been stored');
      return { code: 200, response: { message: 'BK Funnels Lead Informations has been stored' }, created };
    }

    const [_, created] = await bkFunnelsRepository.findOrCreate({ where: { code: codeString, funnelId: funnelIdString } });
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
      const kommoUtils = new KommoUtils();
      const kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
      const bkLeadInfo = await bkFunnelsRepository.findByCode(codeString);

      const { objects: { name, email, phone, datanascimento }, dentista, procedimento, periodo } = bkLeadInfo;

      const leads = await kommo.listLeads({ query: kommoUtils.formatPhone(phone), first_created: true });
      let turno_res;
      if (!leads || leads?.length === 0) {
        turno_res = await kommo.createLeadBk({
          name,
          email,
          phone,
          datanascimento,
          dentista,
          procedimento,
          periodo,
          turno: value,
          code: codeString
        });
      } else {
        turno_res = await kommo.updateLeadBk({
          id: leads[0].id,
          datanascimento,
          dentista,
          procedimento,
          periodo,
          turno: value,
          code: codeString
        });
      }
      await bkFunnelsRepository.updateByCode(codeString, { turno: value });
      styled.success('BK Funnels Lead created and turno has been updated');
      return { code: 200, response: { message: 'BK Funnels Lead created and turno has been updated', turno_res }, created };

    } else if (type === 'quests') {
      const { quests } = await bkFunnelsRepository.findByCode(codeString);
      if (quests) {
        await bkFunnelsRepository.updateByCode(codeString, { quests: [...quests, value] });
      } else {
        await bkFunnelsRepository.updateByCode(codeString, { quests: [value] });
      }
      styled.success('BK Funnels Lead created and quests has been updated');
      return { code: 200, response: { message: 'BK Funnels Lead created and quests has been updated' }, created };

    } else {
      styled.error('Type not found when creating BK Funnels Lead');
      return { code: 404, response: { message: 'Type not found' }, created: false };

    }
  }
};