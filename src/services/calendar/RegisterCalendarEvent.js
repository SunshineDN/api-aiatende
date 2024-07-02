// const { google } = require('googleapis');
// const AuthCalendar = require('../../utils/AuthCalendar');
const { parse } = require('date-fns');
const CalendarIdValidate = require('../../utils/CalendarIdValidate');
const GetCustomFields = require('../kommo/GetCustomFields');
const UpdateLead = require('../kommo/UpdateLead');
const HandlingError = require('../kommo/HandlingError');
const GetUser = require('../kommo/GetUser');
const CalendarUtils = require('../../utils/CalendarUtils');

// const Calendar = async (calendarId, resource)  => {
//   const auth = AuthCalendar.authenticate();
//   const register = new Promise((resolve, reject) => {
//     auth.authorize((err) => {
//       if (err) {
//         console.error('Erro na autenticação:', err);
//         reject(new Error(err));
//       }
//       const calendar = google.calendar({ version: 'v3', auth });
//       calendar.events.insert(
//         {
//           calendarId,
//           resource,
//         },
//         (err, result) => {
//           if (err) {
//             console.error('Erro ao adicionar evento:', err);
//             reject(new Error(err));
//           }
//           console.log('Evento adicionado:', result.data.htmlLink);
//           resolve(result.data);
//         }
//       );
//     });
//   });
//   return await register;
// };

const RegisterCalendarEvent = async (payload, access_token = null) => {
  try {
    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    // console.log('Usuário:');
    // console.dir(user, { depth: null });

    const eventSummary = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Event Summary'
    )[0];
    const eventStart = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Event Start'
    )[0];
    const nameDoctor = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Dentista'
    )[0];

    const eventLink = custom_fields?.filter(
      (field) => field.name === 'Event Link'
    )[0];
    const eventID = custom_fields?.filter(
      (field) => field.name === 'Event ID'
    )[0];

    console.log('Sumário:', eventSummary?.values[0]?.value);
    console.log('Inicio do Evento:', eventStart?.values[0]?.value);

    let eventData = {};

    console.log('Adicionando evento...');
    //console.log(req.body);
    // const { summary, description, start, ...rest } = req.body;
    const summary = eventSummary?.values[0]?.value;
    const startDateTime = parse(
      eventStart?.values[0]?.value,
      'dd/MM/yyyy HH:mm',
      new Date()
    );
    startDateTime.setHours(startDateTime.getHours() + 3);
    let endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);
    console.log('summary:', summary);
    console.log('startDateTime:', startDateTime);
    console.log('endDateTime:', endDateTime);

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
    console.log('Evento:', event);

    try {
      eventData = await CalendarUtils.executeRegisterEvent( CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado'), event);
    } catch {
      eventData = await CalendarUtils.executeRegisterEvent( CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado'), event);
    }

    console.log('Dados do Evento (eventData):', eventData);
    const reqBody = {
      custom_fields_values: [
        {
          field_id: eventID?.id,
          values: [
            {
              value: eventData?.id,
            },
          ],
        },
        {
          field_id: eventLink?.id,
          values: [
            {
              value: eventData?.htmlLink,
            },
          ],
        },
      ],
    };
    console.log('Dados do corpo da requisição (reqBody):', reqBody);
    console.log('Atualizando lead...');

    await UpdateLead(payload, reqBody, access_token);
    console.log('Evento registrado com sucesso!');
  } catch (error) {
    if (error.response) {
      console.log(
        `Erro ao registrar evento no Google Calendar: ${error.response.data}`
      );
      await HandlingError(
        payload,
        access_token,
        `Erro ao registrar evento no Google Calendar: ${error.response.data}`
      );
    } else {
      console.log(
        `Erro ao registrar evento no Google Calendar: ${error.message}`
      );
      await HandlingError(
        payload,
        access_token,
        `Erro ao registrar evento no Google Calendar: ${error.message}`
      );
    }
    throw new Error(`erro no RegisterCalendarEvent: ${error}`);
  }
};

module.exports = RegisterCalendarEvent;
