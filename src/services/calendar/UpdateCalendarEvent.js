const { parse } = require('date-fns');
const AuthCalendar = require('../../utils/AuthCalendar');
const { google } = require('googleapis');
const HandlingError = require('../kommo/HandlingError');
const GetUser = require('../kommo/GetUser');
const CalendarIdValidate = require('../../utils/CalendarIdValidate');

const UpdateCalendarEvent = async (payload, access_token = null) => {
  try {
    const user = await GetUser(payload, false, access_token);

    const eventSummary = user?.custom_fields_values?.filter(field => field.field_name === 'Event Summary')[0];
    const eventStart = user?.custom_fields_values?.filter(field => field.field_name === 'Event Start')[0];
    const eventId = user?.custom_fields_values?.filter(field => field.field_name === 'Event ID')[0];
    const nameDoctor = user?.custom_fields_values?.filter(
      (field) => field.field_name === "Dentista"
    )[0];
  
    console.log('Sumário:', eventSummary?.values[0]?.value);
    console.log('Inicio do Evento:', eventStart?.values[0]?.value);
    console.log('ID do Evento:', eventId?.values[0]?.value);


    const auth = AuthCalendar.authenticate();
    console.log('Atualizando evento...');
    const startDateTime = parse(eventStart, 'dd/MM/yyyy HH:mm', new Date());
    let endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    try {
      auth.authorize((err) => {
        if (err) {
          console.error('Erro na autenticação:', err);
          throw new Error('Erro na autenticação');
        }
        const calendar = google.calendar({ version: 'v3', auth });
        calendar.events.update(
          {
            calendarId: CalendarIdValidate(nameDoctor?.values[0]?.value || "Não Encontrado"),
            eventId,
            resource: {
              eventSummary,
              //description,
              start: {
                dateTime: startDateTime.toISOString(),
              },
              end: {
                dateTime: endDateTime.toISOString(),
              },
            },
          },
          (err, result) => {
            if (err) {
              console.error('Erro ao atualizar evento:', err);
              throw new Error('Erro ao atualizar evento');
            }
            console.log('Evento atualizado:', result.data.htmlLink);
            return result.data;
          });
      });
    }catch{
      auth.authorize((err) => {
        if (err) {
          console.error('Erro na autenticação:', err);
          throw new Error('Erro na autenticação');
        }
        const calendar = google.calendar({ version: 'v3', auth });
        calendar.events.update(
          {
            calendarId: CalendarIdValidate(nameDoctor?.values[0]?.value || "Não Encontrado"),
            eventId,
            resource: {
              eventSummary,
              //description,
              start: {
                dateTime: startDateTime.toISOString(),
              },
              end: {
                dateTime: endDateTime.toISOString(),
              },
            },
          },
          (err, result) => {
            if (err) {
              console.error('Erro ao atualizar evento:', err);
              throw new Error('Erro ao atualizar evento');
            }
            console.log('Evento atualizado:', result.data.htmlLink);
            return result.data;
          });
      });
    }
  }catch (error) {
    if (error.response) {
      console.log(`Erro ao atualizar evento no Google Calendar: ${error.response.data}`);
      await HandlingError(payload, access_token, `Erro ao atualizar evento no Google Calendar: ${error.response.data}`);
    } else {
      console.log(`Erro ao atualizar evento no Google Calendar: ${error.message}`);
      await HandlingError(payload, access_token, `Erro ao atualizar evento no Google Calendar: ${error.message}`);
    }
    throw new Error('Erro no UpdateCalendarEvent');
  }
};

module.exports = UpdateCalendarEvent;
