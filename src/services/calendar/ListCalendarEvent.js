// const AuthCalendar = require('../../utils/AuthCalendar');
// const { google } = require('googleapis');
const CalendarIdValidate = require('../../utils/CalendarIdValidate');
const GetCustomFields = require('../kommo/GetCustomFields');
const UpdateLead = require('../kommo/UpdateLead');
const HandlingError = require('../kommo/HandlingError');
const GetUser = require('../kommo/GetUser');
const CalendarUtils = require('../../utils/CalendarUtils');

// async function Calendar(calendarId) {
//   const auth = AuthCalendar.authenticate();
//   const calendar_return = new Promise((resolve, reject) => {
//     auth.authorize((err) => {
//       if (err) {
//         console.error('Erro na autenticação:', err);
//         reject('Erro na autenticação');
//       }
//       const calendar = google.calendar({ version: 'v3', auth });
//       calendar.events.list(
//         {
//           calendarId: calendarId,
//           timeMin: new Date().toISOString(),
//           maxResults: 50,
//           singleEvents: true,
//           orderBy: 'startTime',
//         },
//         (err, result) => {
//           if (err) {
//             console.error('Erro ao listar eventos do calendário:', err);
//             reject('Erro ao listar eventos do calendário');
//           }
//           const events = result.data.items;
//           if (events.length) {
//             let string = '';
//             string += 'Eventos encontrados:\n';
//             events.map((event) => {
//               const start = new Date(event.start.dateTime).toLocaleString(
//                 'pt-BR',
//                 { timeZone: 'America/Sao_Paulo' }
//               );
//               string += `${start} - ${event.summary}\n`;
//               // Calculo para pegar a duracao do evento
//               const startDate = new Date(event.start.dateTime);
//               const endDate = new Date(event.end.dateTime);
//               let duration = (endDate - startDate) / 60000;
//               if (duration >= 60) {
//                 duration = `${Math.floor(duration / 60)}h${duration % 60}m`;
//               }
//               string += `Duração: ${duration} minutos\n\n`;
//             });
//             console.log(string);
//             resolve(string);
//           } else {
//             resolve('Eventos não encontrados.');
//           }
//         }
//       );
//       console.log('Eventos listados com sucesso!');
//     });
//   });
//   return await calendar_return;
// }

const ListCalendarEvent = async (payload, access_token = null) => {
  try{
    const CalendarUtilsClass = new CalendarUtils(payload?.account?.id);
    let eventData, custom_fields, filledDates, user, nameDoctor;
    user = await GetUser(payload, false, access_token);
      
    nameDoctor = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Dentista'
    )[0];
  
    custom_fields = await GetCustomFields(payload, access_token);
  
    filledDates = custom_fields?.filter(
      (field) => field.name === 'Datas ocupadas'
    )[0];
    try {
      eventData = await CalendarUtilsClass.executeListEvents(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado', payload?.account?.id));
    } catch {
      eventData = await CalendarUtilsClass.executeListEvents(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado', payload?.account?.id));
    }
  }catch(error) {
    if (error.response) {
      console.log(
        `Erro ao listar eventos no Google Calendar: ${error.response.data}`
      );
      await HandlingError(
        payload,
        access_token,
        `Erro ao listar eventos no Google Calendar: ${error.response.data}`
      );
    } else {
      console.log(
        `Erro ao listar eventos no Google Calendar: ${error.message}`
      );
      await HandlingError(
        payload,
        access_token,
        `Erro ao listar eventos no Google Calendar: ${error.message}`
      );
    }
    throw new Error('Erro no ListCalendarEvents');
  }
  const reqBody = {
    custom_fields_values: [
      {
        field_id: filledDates?.id,
        values: [
          {
            value: eventData,
          },
        ],
      },
    ],
  };
  await UpdateLead(payload, reqBody, access_token);
  console.log('Fim do ListCalendar!');
};

module.exports = ListCalendarEvent;
