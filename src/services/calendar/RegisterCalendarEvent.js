const { parse } = require('date-fns');
const { google } = require('googleapis');
const AuthCalendar = require('../../utils/AuthCalendar');
const GetAccessToken = require('../kommo/GetAccessToken');
const GetCustomFields = require('../kommo/GetCustomFields');
const UpdateLead = require('../kommo/UpdateLead');
const HandlingError = require('../kommo/HandlingError');
const GetUser = require('../kommo/GetUser');

const RegisterCalendarEvent = async (payload, access_token = null) => {

  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    // console.log('Usuário:');
    // console.dir(user, { depth: null });

    const eventSummary = user?.custom_fields_values?.filter(field => field.field_name === 'Event Summary')[0];
    const eventStart = user?.custom_fields_values?.filter(field => field.field_name === 'Event Start')[0];
    const motivo = user?.custom_fields_values?.filter(field => field.field_name === 'Motivo Consulta')[0];

    const calendarIDs = {
      juliana: 'ff3376c2855b6c18044adc7017c77b2f41177f1705a27f850339f91568c468fb@group.calendar.google.com',
      dentistas: 'clinicadentalsante@gmail.com'
    };

    const eventLink = custom_fields?.filter(field => field.name === 'Event Link')[0];
    const eventID = custom_fields?.filter(field => field.name === 'Event ID')[0];

    console.log('Sumário:', eventSummary?.values[0]?.value);
    console.log('Inicio do Evento:', eventStart?.values[0]?.value);

    let eventData = {};

    const auth = AuthCalendar.authenticate();
    console.log('Adicionando evento...');
    //console.log(req.body);
    // const { summary, description, start, ...rest } = req.body;
    const summary = eventSummary?.values[0]?.value;
    const startDateTime = parse(eventStart?.values[0]?.value, 'dd/MM/yyyy HH:mm', new Date());
    let endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    const event = {
      summary,
      //description,
      start: {
        dateTime: startDateTime.toISOString(),
      },
      end: {
        dateTime: endDateTime.toISOString(),
      },
      //...rest,
    };

    try {
      auth.authorize((err) => {

        if (err) {
          console.error('Erro na autenticação:', err);
          throw new Error(err);
        }
        const calendar = google.calendar({ version: 'v3', auth });
        calendar.events.insert(
          {
            calendarId: motivo?.values[0]?.value === 'Consulta Inicial' ? calendarIDs.juliana : calendarIDs.dentistas,
            resource: event,
          },
          (err, result) => {
            if (err) {
              console.error('Erro ao adicionar evento:', err);
              throw new Error(err);
            }
            console.log('Evento adicionado:', result.data.htmlLink);
            eventData = result.data;
          });
      });

    } catch {
      auth.authorize((err) => {

        if (err) {
          console.error('Erro na autenticação:', err);
          throw new Error(err);
        }
        const calendar = google.calendar({ version: 'v3', auth });
        calendar.events.insert(
          {
            calendarId: 'clinicadentalsante@gmail.com',
            resource: event,
          },
          (err, result) => {
            if (err) {
              console.error('Erro ao adicionar evento:', err);
              throw new Error(err);
            }
            console.log('Evento adicionado:', result.data.htmlLink);
            eventData = result.data;
          });
      });
    }
    const reqBody = {
      'custom_fields_values': [
        {
          'field_id': eventID?.id,
          'values': [
            {
              'value': eventData?.id
            }
          ]
        },
        {
          'field_id': eventLink?.id,
          'values': [
            {
              'value': eventData?.htmlLink
            }
          ]
        }
      ]
    };

    await UpdateLead(payload, reqBody, access_token);
    console.log('Evento registrado com sucesso!');
  } catch (error) {
    if (error.response) {
      console.log(`Erro ao registrar evento no Google Calendar: ${error.response.data}`);
      await HandlingError(payload, access_token, `Erro ao registrar evento no Google Calendar: ${error.response.data}`);
    } else {
      console.log(`Erro ao registrar evento no Google Calendar: ${error.message}`);
      await HandlingError(payload, access_token, `Erro ao registrar evento no Google Calendar: ${error.message}`);
    }
    throw new Error(`erro no RegisterCalendarEvent: ${error}`);
  }
};

module.exports = RegisterCalendarEvent;
