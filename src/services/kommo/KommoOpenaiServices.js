import KommoUtils from "../../utils/KommoUtils.js";
import KommoServices from "./KommoServices.js"

export default class KommoOpenaiServices extends KommoServices {
  constructor({ auth, url }) {
    super({ auth, url });
  }

  async sendMessage({ lead_id, message }) {
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields() });

    const answerField = kommoUtils.findLeadsFieldByName('GPT | Answer');
    const logField = kommoUtils.findLeadsFieldByName('GPT | LOG');
    const custom_fields_values = [
      {
        field_id: answerField.id,
        values: [
          {
            value: message
          }
        ]
      },
      {
        field_id: logField.id,
        values: [
          {
            value: 'ok'
          }
        ]
      }
    ]

    const response = await this.updateLead({ id: lead_id, custom_fields_values });
    return response;
  }

  async sendErrorLog({ lead_id, error }) {
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields() });

    const logField = kommoUtils.findLeadsFieldByName('GPT | LOG');
    const custom_fields_values = [
      {
        field_id: logField.id,
        values: [
          {
            value: error
          }
        ]
      }
    ]

    const response = await this.updateLead({ id: lead_id, custom_fields_values });
    return response;
  }
}