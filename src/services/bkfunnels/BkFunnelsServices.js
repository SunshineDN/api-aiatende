import BkFunnelsUtils from "../../utils/BkFunnelsUtils.js";

export default class BkFunnelsServices {
  static async createUpdateLead(body) {
    const { type, value } = BkFunnelsUtils.identifyAnswer(body);

    if (type === 'lead') {
      
    }
  }
};