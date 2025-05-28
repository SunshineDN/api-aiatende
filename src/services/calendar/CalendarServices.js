import styled from "../../utils/log/styled.js";
import AuthCalendar from "../../utils/calendar/AuthCalendar.js";
import { google } from "googleapis";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import isBetween from "dayjs/plugin/isBetween.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

import 'dayjs/locale/pt-br.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

export default class CalendarServices {
  #calendar_id;
  #calendar;

  /**
   * @param {string} calendar_id - ID do calendário
   */
  constructor(calendar_id) {
    this.#calendar_id = calendar_id;
    this.#calendar = google.calendar('v3');
    AuthCalendar.authenticate();
  }

  /**
   * Retorna as datas e horários disponíveis para agendamento
   * @returns {Promise<Array<string>>} - Array com as datas e horários disponíveis para agendamento
   */
  async getAvailableOptions() {
    // const now = dayjs("2025-02-05T10:29:00");
    const now = dayjs().tz("America/Sao_Paulo");
    const startDate = now.startOf("day");
    const endDate = now.add(30, "day").endOf("day");

    // Horário de funcionamento atualizado
    const businessHours = {
      weekday: { start: 8, end: 19, endMinutes: 30 }, // Segunda a sexta até 19:30
      saturday: { start: 8, end: 12, endMinutes: 30 } // Sábado até 12:30
    };

    const getWorkingHours = (date) => {
      const day = date.day();
      if (day === 0) return null; // Domingo fechado
      return day === 6 ? businessHours.saturday : businessHours.weekday;
    };

    //Corrigir o horário inicial para garantir 1h depois da data atual
    let startSearchTime = now.add(1, "hour").startOf("minute");

    let workingHours = getWorkingHours(startSearchTime);

    if (!workingHours || startSearchTime.hour() >= workingHours.end) {
      // Se estiver fora do expediente, pula para o próximo dia útil às 8h
      do {
        startSearchTime = startSearchTime.add(1, "day").hour(8).minute(0);
        workingHours = getWorkingHours(startSearchTime);
      } while (!workingHours);
    } else if (startSearchTime.hour() < workingHours.start) {
      // Se for antes do expediente, ajusta para as 8h
      startSearchTime = startSearchTime.hour(workingHours.start).minute(0);
    } else if (![0, 30].includes(startSearchTime.minute())) {
      // Ajusta para o próximo múltiplo de 30 minutos
      startSearchTime = startSearchTime.minute() < 30 ? startSearchTime.minute(30) : startSearchTime.add(1, "hour").minute(0);
    }

    // Buscar eventos no calendário
    const events = await this.#calendar.events.list({
      calendarId: this.#calendar_id,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    let eventSlots = events.data.items.map(event => ({
      start: dayjs(event.start.dateTime || event.start.date),
      end: dayjs(event.end.dateTime || event.end.date)
    }));

    let availableSlots = new Set();
    let currentTime = startSearchTime;

    while (currentTime.isBefore(endDate)) {
      const workingHours = getWorkingHours(currentTime);
      if (!workingHours) {
        currentTime = currentTime.add(1, "day").hour(8).minute(0);
        continue;
      }

      let slotStart = currentTime.startOf("minute");
      if (![0, 30].includes(slotStart.minute())) {
        slotStart = slotStart.minute() < 30 ? slotStart.minute(30) : slotStart.add(1, "hour").minute(0);
      }

      const dayEnd = slotStart.hour(workingHours.end).minute(workingHours.endMinutes);

      while (slotStart.isSameOrBefore(dayEnd)) {
        if (!eventSlots.some(event => slotStart.isBetween(event.start, event.end, null, "[)"))) {
          availableSlots.add(slotStart.format("DD/MM/YYYY HH:mm"));
        }
        slotStart = slotStart.add(30, "minute");
      }

      currentTime = currentTime.add(1, "day").hour(8).minute(0);
    }

    return Array.from(availableSlots);
  }

  /**
   * Verifica se a data escolhida está disponível para agendamento
   * @param {string} date - Data escolhida
   * @returns {Promise<Array<string>>} - Retorna um array com as datas disponíveis
   */
  async getChoiceDate(date) {
    const formattedDate = dayjs(date, "DD/MM/YYYY").format("DD/MM/YYYY");
    styled.info("Formatted date:", formattedDate);

    // Verificar se a data escolhida está disponível
    const availableOptions = await this.getAvailableOptions();
    return availableOptions.filter(option => option.startsWith(formattedDate));
  }

  /**
   * Verifica se a data e hora escolhidas estão disponíveis para agendamento
   * @param {string} date - Data escolhida
   * @param {string} time - Hora escolhida
   * @returns {Promise<Array<string>>} - Retorna um array com as datas e horários disponíveis
   */
  async getChoiceDateTime(date, time) {
    const formattedDate = dayjs(date, "DD/MM/YYYY").format("DD/MM/YYYY");

    let availableOptions;
    if (formattedDate instanceof Date && !isNaN(date) && time) {
      styled.info("Data válida:", formattedDate);

      // Verificar se a data escolhida está disponível
      availableOptions = await this.getAvailableOptions();
      return availableOptions.filter(option => option.startsWith(formattedDate) && option.endsWith(time));
    } else if (formattedDate instanceof Date && !isNaN(date)) {

      availableOptions = await this.getAvailableOptions();
      return availableOptions.filter(option => option.startsWith(formattedDate));
    } else {
      
      availableOptions = await this.getAvailableOptions();
      return availableOptions;
    }
  }

  /**
   * Cria um evento no calendário
   * @param {object} event - Objeto com as informações do evento a ser criado
   * @param {string} event.summary - Título do evento
   * @param {Date} event.start - Data e hora de início do evento
   * @param {Date} event.end - Data e hora de término do evento
   * @param {string} [event.description=""] - Descrição do evento
   * @returns {Promise<object>} - Objeto com as informações do evento criado
   */
  async createEvent({ summary = "", start, end, description = "" } = {}) {
    const response = await this.#calendar.events.insert({
      calendarId: this.#calendar_id,
      requestBody: {
        summary,
        start: {
          dateTime: start.toISOString(),
          timeZone: "America/Recife"
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: "America/Recife"
        },
        description
      }
    });

    return response.data;
  }

  /**
   * Obtém um evento do calendário
   * @param {string} eventId - ID do evento a ser obtido
   * @returns {Promise<object>} - Objeto com as informações do evento
   */
  async getEvent(eventId) {
    const response = await this.#calendar.events.get({
      calendarId: this.#calendar_id,
      eventId
    });
    return response.data;
  }

  /**
   * Atualiza um evento no calendário
   * @param {object} event - Objeto com as informações do evento a ser atualizado
   * @param {string} event.eventId - ID do evento a ser atualizado
   * @param {string} event.summary - Título do evento
   * @param {Date} event.start - Data e hora de início do evento
   * @param {Date} event.end - Data e hora de término do evento
   * @param {string} [event.description=""] - Descrição do evento
   * @returns {Promise<object>} - Objeto com as informações do evento atualizado
   */
  async updateEvent({ eventId, summary = "", start, end, description = "" } = {}) {
    const response = await this.#calendar.events.update({
      calendarId: this.#calendar_id,
      eventId,
      requestBody: {
        summary,
        start: {
          dateTime: start.toISOString(),
          timeZone: "America/Recife"
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: "America/Recife"
        },
        description
      }
    });

    return response.data;
  }

  /**
   * Deleta um evento no calendário
   * @param {string} eventId - ID do evento a ser deletado
   * @returns {Promise<string>} - Retorna uma Promise que resolve quando o evento for deletado
   */
  async deleteEvent(eventId) {
    await this.#calendar.events.delete({
      calendarId: this.#calendar_id,
      eventId
    });
    return `Evento ${eventId} deletado com sucesso!`;
  }
}