import KommoServices from "../kommo/KommoServices.js";
import styled from "../../utils/log/styled.js";
import LeadUtils from "../../utils/LeadUtils.js";
import StaticUtils from "../../utils/StaticUtils.js";
import KommoUtils from "../../utils/KommoUtils.js";
import DateUtils from "../../utils/DateUtils.js";
import LeadMessagesRepository from "../../repositories/LeadMessagesRepository.js";
import EvolutionApiServices from "../evolutionapi/EvolutionApiServices.js";

export default class OpenAICrmServices {
  #lead_id;
  #lead;
  #kommo;
  #evolutionApi;

  constructor({ lead_id }) {
    this.#kommo = new KommoServices({
      auth: process.env.KOMMO_AUTH,
      url: process.env.KOMMO_URL,
    });
    this.#evolutionApi = new EvolutionApiServices({
      apiKey: process.env.EVOLUTION_API_KEY,
      instance: process.env.EVOLUTION_API_INSTANCE_ID,
    });
    this.#lead_id = lead_id;
  }

  async getLead() {
    if (!this.#lead) {
      this.#lead = await this.#kommo.getLead({ id: this.#lead_id, withParams: "contacts" });
    }

    return this.#lead;
  }

  async getLeadAdditionalInfo() {
    const contact = this.#lead.contact;

    const phoneNumber = LeadUtils.getPhoneNumber({ contact });
    const date = DateUtils.getActualDatetimeInformation();

    return `
    System Additional Informations:
    Current date: ${date}

    User data:
    ID do lead: ${this.#lead_id}
    Número de telefone: ${phoneNumber}`
  }

  async verifyLeadMessageField() {
    const message_received = LeadUtils.findLeadField({ lead: this.#lead, field_name: "GPT | Message received" });
    if (message_received) {
      await StaticUtils.sleep(2);
      await this.#kommo.updateLead({ id: this.#lead_id, custom_fields_values: [{ field_id: message_received.field_id, values: [{ value: "" }] }] });
    }
    return;
  }

  async sendMessageToLead({ message }) {
    const leadMessageRepo = new LeadMessagesRepository();
    const send_message = await leadMessageRepo.setBoolSendMessage(this.#lead_id);

    if (!send_message) {
      styled.warning(`[OpenAICrmServices.sendMessageToLead] - A origem do lead não é do WhatsApp Lite!`);
      return;
    }

    const contact = this.#lead.contact;
    const phoneNumber = LeadUtils.getPhoneNumber({ contact });

    await this.#evolutionApi.sendMessage({
      message,
      number: phoneNumber,
    })
  }

  async saveAssistantAnswer({ message }) {
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.#kommo.getLeadsCustomFields() });

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