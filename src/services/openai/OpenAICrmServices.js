import KommoServices from "../kommo/KommoServices.js";
import styled from "../../utils/log/styled.js";
import LeadUtils from "../../utils/LeadUtils.js";
import StaticUtils from "../../utils/StaticUtils.js";
import KommoUtils from "../../utils/KommoUtils";

export default class OpenAICrmServices {
  #lead_id;
  #lead;
  #kommo;

  constructor({ lead_id }) {
    this.#kommo = new KommoServices({
      auth: process.env.KOMMO_AUTH,
      url: process.env.KOMMO_URL,
    });
    this.#lead_id = lead_id;
  }

  async getLead() {
    if (!this.#lead) {
      this.#lead = await this.#kommo.getLead({ id: this.#lead_id, withParams: "contacts" });
    }

    return this.#lead;
  }

  async verifyLeadMessageField() {
    const message_received = LeadUtils.findLeadField({ lead: this.#lead, field_name: "GPT | Message received" });
    if (message_received) {
      await StaticUtils.sleep(2);
      await this.#kommo.updateLead({ id: this.#lead_id, custom_fields_values: [{ field_id: message_received.field_id, values: [{ value: "" }] }] });
    }
    return;
  }

  async saveAssistantAnswer({ message }) {
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields() });

    const answerField = kommoUtils.findLeadsFieldByName("GPT | Answer");
    const logField = kommoUtils.findLeadsFieldByName("GPT | LOG");
    const custom_fields_values = [
      {
        field_id: answerField.id,
        values: [
          {
            value: StaticUtils.substituteEmojisAnswer(message),
          },
        ],
      },
      {
        field_id: logField.id,
        values: [
          {
            value: "ok",
          },
        ],
      },
    ];

    await this.#kommo.updateLead({ id: this.#lead_id, custom_fields_values });
    styled.success(`[OpenAICrmServices.saveAssistantAnswer] - Resposta do assistente salva com sucesso no CRM!`);
    return;
  }
}