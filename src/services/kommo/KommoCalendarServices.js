import KommoUtils from "../../utils/KommoUtils";
import KommoServices from "./KommoServices";
import CalendarServices from "../calendar/CalendarServices";

export default class KommoCalendarServices {
  #calendar_id;
  #lead_id;
  #calendar;
  #kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });

  /**
   * @param {string} calendar_id - ID do calendário
   * @param {string} lead_id - ID do lead
   */
  constructor(calendar_id, lead_id) {
    this.#calendar_id = calendar_id;
    this.#lead_id = lead_id;
    this.#calendar = google.calendar('v3');
    AuthCalendar.authenticate();
  }

  async scheduleLead({ auto_summary = true, description = '' } = {}) {
    const lead = await this.#kommo.getLead({ id: this.#lead_id, withParams: 'contacts' });
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.#kommo.getLeadsCustomFields(), pipelines: await this.#kommo.getPipelines() });

    const agendamento = LeadUtils.findLeadField({ lead, fieldName: 'Data do Agendamento', value: true });
    const scheduleStatus = LeadUtils.findLeadField({ lead, fieldName: 'Status do Agendamento', value: true });
    const profissional = LeadUtils.findLeadField({ lead, fieldName: 'Profissional', value: true });
    const whoScheduled = LeadUtils.findLeadField({ lead, fieldName: 'Agendado por', value: true });
    
    let summary;
    if (auto_summary) {
      const nome = lead?.contact?.name;
      const service = LeadUtils.findLeadField({ lead, fieldName: 'Serviço', value: true });
      summary = `${nome} - ${service}`;
    } else {
      summary = LeadUtils.findLeadField({ lead, fieldName: 'Título do Evento', value: true });
    }

    if (description === '') {
      description = LeadUtils.findLeadField({ lead, fieldName: 'Descrição do Evento', value: true });
    }

    const lastScheduleField = kommoUtils.findLeadsFieldByName('Último Agendamento');
    const scheduleStatusField = kommoUtils.findLeadsFieldByName('Status do Agendamento');
    const profissionalField = kommoUtils.findLeadsFieldByName('Profissional');
    const whoScheduledField = kommoUtils.findLeadsFieldByName('Agendado por');

    const eventLinkField = kommoUtils.findLeadsFieldByName('Link do Evento');
    const eventIdField = kommoUtils.findLeadsFieldByName('ID do Evento');
    const eventSummaryField = kommoUtils.findLeadsFieldByName('Título do Evento');
    const eventDescriptionField = kommoUtils.findLeadsFieldByName('Descrição do Evento');

    const closedWon = kommoUtils.findStatusByCode('03 - PRÉ-AGENDAMENTO', 142);

    const calendar = new CalendarServices(this.#calendar_id);
    const registerEvent = await calendar.createEvent({ summary, description, start: agendamento, end: agendamento });

  }
}