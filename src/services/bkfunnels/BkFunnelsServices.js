import BkFunnelsRepository from "../../repositories/BkFunnelsRepository.js";
import BkFunnelsUtils from "../../utils/BkFunnelsUtils.js";

export default class BkFunnelsServices {

  static async createUpdateLead(body) {
    const { code } = body;
    const { type, value } = BkFunnelsUtils.identifyAnswer(body);
    const bkFunnelsRepository = new BkFunnelsRepository();

    if (type === 'lead') {
      const [_, __] = bkFunnelsRepository.findOrCreate({ where: { code } });
      await bkFunnelsRepository.updateByCode(code, { objects: JSON.stringify(value) });
      return
    }

    if (type === 'quest') {
      const [_, created] = bkFunnelsRepository.findOrCreate({ where: { code } });
      if (created) {
        await bkFunnelsRepository.updateByCode(code, { quests: value });
        return;
      } else {
        const { quests } = await bkFunnelsRepository.findByCode(code);
        await bkFunnelsRepository.updateByCode(code, { quests: [...quests, value] });
        return;
      }
    }
  }
};