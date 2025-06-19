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
    ${date}

    User data:
    ID do lead: ${this.#lead_id}
    Número de telefone: ${phoneNumber}`
  }

  async verifyLeadMessageField() {
    const message_received = LeadUtils.findLeadField({ lead: this.#lead, fieldName: "GPT | Message received" });
    styled.info(`[OpenAICrmServices.verifyLeadMessageField] - Verificando se o campo "GPT | Message received" existe no lead...`);
    styled.infodir(message_received);
    if (message_received) {
      styled.info(`[OpenAICrmServices.verifyLeadMessageField] - Campo "GPT | Message received" encontrado!`);
      await StaticUtils.sleep(2);
      await this.#kommo.updateLead({ id: this.#lead_id, custom_fields_values: [{ field_id: message_received.field_id, values: [{ value: "" }] }] });
    }
    return;
  }

  async setAppointmentDate({ date, htmlLink, event_id, description }) {

    const to_date = new Date(date);
    const date_in_seconds = DateUtils.dateToSeconds(to_date);

    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.#kommo.getLeadsCustomFields() });

    const lastAppointmentField = kommoUtils.findLeadsFieldByName("Último compromisso");
    const actualAppointmentField = kommoUtils.findLeadsFieldByName("Data do Compromisso");
    const eventLinkField = kommoUtils.findLeadsFieldByName("Link do Evento");
    const eventIdField = kommoUtils.findLeadsFieldByName("ID do Evento");
    const appointmentReasonField = kommoUtils.findLeadsFieldByName("Motivo do Compromisso");

    const lead = await this.getLead();

    const leadLastAppointmentField = LeadUtils.findLeadField({ lead, fieldName: "Último compromisso", value: true });
    const leadActualAppointmentField = LeadUtils.findLeadField({ lead, fieldName: "Data do Compromisso", value: true });

    const custom_fields_values = [];

    if (!leadLastAppointmentField) {
      custom_fields_values.push({
        field_id: lastAppointmentField.id,
        values: [{ value: date_in_seconds }],
      });
    } else {
      custom_fields_values.push({
        field_id: lastAppointmentField.id,
        values: [{ value: leadActualAppointmentField }],
      });
    }

    if (date_in_seconds && actualAppointmentField) {
      custom_fields_values.push({
        field_id: actualAppointmentField.id,
        values: [{ value: date_in_seconds }],
      });
    }

    if (htmlLink && eventLinkField) {
      custom_fields_values.push({
        field_id: eventLinkField.id,
        values: [{ value: htmlLink }],
      });
    }

    if (event_id && eventIdField) {
      custom_fields_values.push({
        field_id: eventIdField.id,
        values: [{ value: event_id }],
      });
    }

    if (description && appointmentReasonField) {
      custom_fields_values.push({
        field_id: appointmentReasonField.id,
        values: [{ value: description }],
      });
    }

    await this.#kommo.updateLead({ id: this.#lead_id, custom_fields_values });
    styled.success(`[OpenAICrmServices.setAppointmentDate] - Data do compromisso atualizada com sucesso!`);
    return;
  }

  async emptyAppointmentDate() {
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.#kommo.getLeadsCustomFields() });

    const actualAppointmentField = kommoUtils.findLeadsFieldByName("Data do Compromisso");
    const eventLinkField = kommoUtils.findLeadsFieldByName("Link do Evento");
    const eventIdField = kommoUtils.findLeadsFieldByName("ID do Evento");

    const custom_fields_values = [];

    if (actualAppointmentField) {
      custom_fields_values.push({
        field_id: actualAppointmentField.id,
        values: [{ value: 0 }],
      });
    }

    if (eventLinkField) {
      custom_fields_values.push({
        field_id: eventLinkField.id,
        values: [{ value: "" }],
      });
    }

    if (eventIdField) {
      custom_fields_values.push({
        field_id: eventIdField.id,
        values: [{ value: "" }],
      });
    }

    await this.#kommo.updateLead({ id: this.#lead_id, custom_fields_values });
    styled.success(`[OpenAICrmServices.emptyAppointmentDate] - Data do compromisso esvaziada com sucesso!`);
    return;
  }

  async updateAppointmentDate({ date, description }) {
    const to_date = new Date(date);
    const date_in_seconds = DateUtils.dateToSeconds(to_date);

    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.#kommo.getLeadsCustomFields() });

    const actualAppointmentField = kommoUtils.findLeadsFieldByName("Data do Compromisso");
    const appointmentReasonField = kommoUtils.findLeadsFieldByName("Motivo do Compromisso");

    const custom_fields_values = [];

    if (date_in_seconds && actualAppointmentField) {
      custom_fields_values.push({
        field_id: actualAppointmentField.id,
        values: [{ value: date_in_seconds }],
      });
    }

    if (description && appointmentReasonField) {
      custom_fields_values.push({
        field_id: appointmentReasonField.id,
        values: [{ value: description }],
      });
    }

    await this.#kommo.updateLead({ id: this.#lead_id, custom_fields_values });
    styled.success(`[OpenAICrmServices.updateAppointmentDate] - Data do compromisso atualizada com sucesso!`);
    return;
  }

  async sendMessageToLead({ message }) {
    const leadMessageRepo = new LeadMessagesRepository();
    const send_message = await leadMessageRepo.setBoolSendMessage({ lead_id: this.#lead_id});

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

    styled.info(`[OpenAICrmServices.saveAssistantAnswer] - Lead ID: ${this.#lead_id}`);
    styled.info(`[OpenAICrmServices.saveAssistantAnswer] - Salvando resposta do assistente no CRM...`);
    styled.infodir(custom_fields_values);
    await this.#kommo.updateLead({ id: this.#lead_id, custom_fields_values });
    styled.success(`[OpenAICrmServices.saveAssistantAnswer] - Resposta do assistente salva com sucesso no CRM!`);
    return;
  }
}