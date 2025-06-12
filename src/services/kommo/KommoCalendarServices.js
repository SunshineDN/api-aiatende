import CustomError from "../../utils/CustomError.js";
import DateUtils from "../../utils/DateUtils.js";
import KommoUtils from "../../utils/KommoUtils.js";
import LeadUtils from "../../utils/LeadUtils.js";
import StaticUtils from "../../utils/StaticUtils.js";
import { CalendarUtils } from "../../utils/calendar/CalendarUtils.js";
import styled from "../../utils/log/styled.js";
import CalendarServices from "../calendar/CalendarServices.js";
import OpenAIServices from "../openai/OpenAIServices.js";
import KommoServices from "./KommoServices.js";

export default class KommoCalendarServices {
  #lead_id;
  #kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });

  /**
   * @param {number} lead_id - ID do lead
   */
  constructor(lead_id) {
    this.#lead_id = lead_id;
  }

  /**
   * Agenda um evento no calendário
   * @param {object} options - Opções para leadAgendamento
   * @param {string} [options.description=''] - Descrição do evento
   * @param {string} [options.dateString=''] - Data do evento no formato 'DD/MM/YYYY HH:mm'
   * @param {string} [options.profissional=''] - Nome do profissional
   * @returns {Promise<object>} - Objeto com as informações do evento agendado
   * @example
   * const calendar = new KommoCalendarServices('id_do_calendario', 'id_do_lead');
   * const event = await calendar.scheduleLead({ auto_summary: true, description: 'Descrição do evento', dateString: '08/01/2025 10:00', profissional: 'nome_do_profissional' });
   * console.log(event);
   * @example
   * const calendar = new KommoCalendarServices('id_do_calendario', 'id_do_lead');
   * const event = await calendar.scheduleLead();
   * console.log(event);
   */
  async scheduleLead({ description = '', dateString = '', profissional = '' } = {}) {
    const lead = await this.#kommo.getLead({ id: this.#lead_id, withParams: 'contacts' });
    const nome = lead?.contact?.name;

    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.#kommo.getLeadsCustomFields(), pipelines: await this.#kommo.getPipelines() });

    const leadScheduledDate = LeadUtils.findLeadField({ lead, fieldName: 'Data do Compromisso', value: true });
    const leadScheduleStatus = LeadUtils.findLeadField({ lead, fieldName: 'Status do Agendamento', value: true });

    const service = LeadUtils.findLeadField({ lead, fieldName: 'Serviço', value: true });
    const summary = `${nome} - ${service}`;

    if (description === '') {
      description = LeadUtils.findLeadField({ lead, fieldName: 'Descrição do Evento', value: true }) || 'Agendamento automático via Webhook';
    }

    let startDateTime;
    if (dateString !== '') {
      startDateTime = DateUtils.toDateTime(dateString);

    } else {
      const leadEventDate = LeadUtils.findLeadField({ lead, fieldName: 'Data do Evento', value: true });

      if (!leadEventDate) {
        throw new CustomError({ message: 'Data do Evento não encontrada no lead', lead_id: this.#lead_id });
      }

      startDateTime = DateUtils.secondsToDate(Number(leadEventDate));
    }

    // startDateTime.setHours(startDateTime.getHours() + 3);
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);

    let calendar_id;
    if (profissional !== '') {
      calendar_id = CalendarUtils.idValidate(profissional);
    } else {
      profissional = LeadUtils.findLeadField({ lead, fieldName: 'Profissional', value: true });

      if (!profissional) {
        throw new Error('Profissional não encontrado no lead');
      }

      calendar_id = CalendarUtils.idValidate(profissional);
    }

    const scheduledDateField = kommoUtils.findLeadsFieldByName('Data do Compromisso');
    const lastScheduleField = kommoUtils.findLeadsFieldByName('Último compromisso');
    const scheduleStatusField = kommoUtils.findLeadsFieldByName('Status do Agendamento');
    const profissionalField = kommoUtils.findLeadsFieldByName('Profissional');
    const whenScheduledField = kommoUtils.findLeadsFieldByName('Quando foi agendado');

    const eventLinkField = kommoUtils.findLeadsFieldByName('Link do Evento');
    const eventIdField = kommoUtils.findLeadsFieldByName('ID do Evento');
    const eventSummaryField = kommoUtils.findLeadsFieldByName('Título do Evento');
    const eventDescriptionField = kommoUtils.findLeadsFieldByName('Descrição do Evento');

    const closedWon = kommoUtils.findStatusByCode('PRÉ-AGENDAMENTO', 142);

    const custom_fields = [
      {
        field_id: whenScheduledField.id,
        values: [
          {
            value: DateUtils.dateToSeconds(),
          }
        ]
      },
      {
        field_id: lastScheduleField.id,
        values: [
          {
            value: leadScheduledDate ? leadScheduledDate : DateUtils.dateToSeconds(startDateTime),
          }
        ]
      },
      {
        field_id: scheduledDateField.id,
        values: [
          {
            value: DateUtils.dateToSeconds(startDateTime),
          }
        ]
      },
      {
        field_id: scheduleStatusField.id,
        values: [
          {
            value: leadScheduleStatus === 'Agendou' || leadScheduleStatus === 'Reagendou' ? 'Reagendou' : 'Agendou',
          }
        ]
      },
      {
        field_id: eventSummaryField.id,
        values: [
          {
            value: summary,
          }
        ]
      },
      {
        field_id: eventDescriptionField.id,
        values: [
          {
            value: description,
          }
        ]
      }
    ]

    if (dateString !== '') {
      const whoScheduledField = kommoUtils.findLeadsFieldByName('Agendado por');
      custom_fields.push({
        field_id: whoScheduledField.id,
        values: [
          {
            value: 'Assistente Virtual',
          }
        ]
      });

      const eventDateField = kommoUtils.findLeadsFieldByName('Data do Evento');
      custom_fields.push({
        field_id: eventDateField.id,
        values: [
          {
            value: DateUtils.dateToSeconds(startDateTime),
          }
        ]
      });
    }

    if (profissional !== '') {
      custom_fields.push({
        field_id: profissionalField.id,
        values: [
          {
            value: StaticUtils.getProfissionalName(profissional),
          }
        ]
      });
    }

    const calendar = new CalendarServices(calendar_id);
    styled.info('[KommoCalendarServices.scheduleLead] Agendando lead com as seguintes informações:');
    styled.infodir({
      summary,
      description,
      startDateTime,
      endDateTime
    });

    let eventResponse;
    const isScheduled = LeadUtils.findLeadField({ lead, fieldName: 'ID do Evento', value: true });
    if (isScheduled) {
      eventResponse = await calendar.updateEvent({ eventId: isScheduled, summary, description, start: startDateTime, end: endDateTime });
    } else {
      eventResponse = await calendar.createEvent({ summary, description, start: startDateTime, end: endDateTime });
    }

    custom_fields.push(
      {
        field_id: eventIdField.id,
        values: [
          {
            value: eventResponse.id,
          }
        ]
      },
      {
        field_id: eventLinkField.id,
        values: [
          {
            value: eventResponse.htmlLink,
          }
        ]
      }
    );

    await this.#kommo.updateLead({
      id: this.#lead_id,
      status_id: closedWon.id,
      pipeline_id: closedWon.pipeline_id,
      custom_fields_values: custom_fields
    });

    const eventResponseMessage = `
**System Message:**
📅 **Usuário agendado com sucesso para o profissional ${profissional}!**
- **Data:** ${DateUtils.formatDate({ date: startDateTime, withWeekday: true })}
- **Link do Evento:** ${eventResponse.htmlLink}
- **ID do Evento:** ${eventResponse.id}
- **Full Calendar Response:** ${JSON.stringify(eventResponse)}
`;

    const openai = new OpenAIServices({ lead_id: this.#lead_id });
    const assistant_id = atob(process.env.OPENAI_ASSISTANT_ID);
    const res = await openai.handleRunAssistant({ userMessage: eventResponseMessage, assistant_id });
    return { event: eventResponse, assistant_response: res };
  }
}