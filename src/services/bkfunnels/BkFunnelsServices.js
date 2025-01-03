import BkFunnelsRepository from "../../repositories/BkFunnelsRepository.js";
import BkFunnelsUtils from "../../utils/BkFunnelsUtils.js";
import KommoServices from "../kommo/KommoServices.js";

export default class BkFunnelsServices {

  static async createUpdateLead(body, res) {
    const { code } = body;
    const { type, value } = BkFunnelsUtils.identifyAnswer(body);

    if (type === 'not_found') {
      return { code: 404, response: { message: 'Type not found' } };
    }

    const bkFunnelsRepository = new BkFunnelsRepository();
    const turnoOptions = ['Manhã (8h às 12h)', 'Tarde (14h às 18h)', 'Noite (18h às 20h)', 'Especial (12h às 14h)']

    if (value === turnoOptions[0] || value === turnoOptions[1] || value === turnoOptions[2] || value === turnoOptions[3]) {
      const kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
      const leads = await kommo.listLeads({ query: code });
      if (leads.length === 0) {
        const bkLeadInfo = await bkFunnelsRepository.findByCode(code);
        const { objects: { name, email, phone, datanascimento }, dentista, procedimento, periodo, turno } = bkLeadInfo;
        const lead = { name, email, phone, datanascimento, dentista, procedimento, periodo, turno, code };
      }
    }

    if (type === 'lead') {
      const [_, __] = bkFunnelsRepository.findOrCreate({ where: { code } });
      await bkFunnelsRepository.updateByCode(code, { objects: JSON.stringify(value) });
      return { code: 200, response: { message: 'BK Funnels Lead Informations has been stored' } };
    } else {
      const [_, created] = bkFunnelsRepository.findOrCreate({ where: { code } });
      if (created) {
        if (type === 'dentista') {
          await bkFunnelsRepository.updateByCode(code, { dentista: value });
          return { code: 200, response: { message: 'BK Funnels Lead created and dentista has been updated' } };
        } else if (type === 'procedimento') {
          await bkFunnelsRepository.updateByCode(code, { procedimento: value });
          return { code: 200, response: { message: 'BK Funnels Lead created and procedimento has been updated' } };
        } else if (type === 'periodo') {
          await bkFunnelsRepository.updateByCode(code, { periodo: value });
          return { code: 200, response: { message: 'BK Funnels Lead created and periodo has been updated' } };
        } else if (type === 'turno') {
          await bkFunnelsRepository.updateByCode(code, { turno: value });
          return { code: 200, response: { message: 'BK Funnels Lead created and turno has been updated' } };
        } else if (type === 'quests') {
          await bkFunnelsRepository.updateByCode(code, { quests: [value] });
          return { code: 200, response: { message: 'BK Funnels Lead created and quests has been updated' } };
        } else {
          return { code: 404, response: { message: 'Type not found' } }
        }
      } else {
        if (type === 'dentista') {
          await bkFunnelsRepository.updateByCode(code, { dentista: value });
          return { code: 200, response: { message: 'BK Funnels Lead dentista has been updated' } };
        } else if (type === 'procedimento') {
          await bkFunnelsRepository.updateByCode(code, { procedimento: value });
          return { code: 200, response: { message: 'BK Funnels Lead procedimento has been updated' } };
        } else if (type === 'periodo') {
          await bkFunnelsRepository.updateByCode(code, { periodo: value });
          return { code: 200, response: { message: 'BK Funnels Lead periodo has been updated' } };
        } else if (type === 'turno') {
          await bkFunnelsRepository.updateByCode(code, { turno: value });
          return { code: 200, response: { message: 'BK Funnels Lead turno has been updated' } };
        } else if (type === 'quests') {
          const { quests } = await bkFunnelsRepository.findByCode(code);
          await bkFunnelsRepository.updateByCode(code, { quests: [...quests, value] });
          return { code: 200, response: { message: 'BK Funnels Lead quests has been updated' } };
        } else {
          return { code: 404, response: { message: 'Type not found' } };
        }
      }
    }
  }
};