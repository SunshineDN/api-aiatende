import KommoServices from "../kommo/KommoServices.js"
import styled from "../../utils/log/styled.js";
import KommoUtils from "../../utils/KommoUtils.js";
import AuthCalendar from "../../utils/calendar/AuthCalendar.js";
import { google } from "googleapis";

export default class CalendarServices {
  #calendar_id;
  #authorization;

  constructor(calendar_id) {
    this.#calendar_id = calendar_id;
    this.#authorization = AuthCalendar.authenticate();
  }

  async listAvailableOptions() {
    const calendar_return = new Promise((resolve, reject) => {
      this.#authorization.authorize((err) => {
        if (err) {
          styled.error('Erro na autenticação:', err);
          reject('Erro na autenticação');
          return;
        }
        const calendar = google.calendar({ version: 'v3', auth: this.#authorization });
        calendar.events.list(
          {
            calendarId: this.#calendar_id,
            eventTypes: 'outOfOffice',
            maxResults: 600,
            singleEvents: true,
            orderBy: 'startTime',
          },
          (err, result) => {
            if (err) {
              styled.error('Erro ao listar eventos do calendário:', err);
              reject(new Error('Erro ao listar eventos do calendário'));
              return;
            }
            const events = result.data.items;
            if (err) {
              styled.error('Erro ao listar opções disponíveis:', err);
              reject(new Error('Erro ao listar opções disponíveis'));
            }

            resolve(events);
          });
        styled.success('Eventos listados com sucesso!');
      });
    });
    return await calendar_return;
  }
}