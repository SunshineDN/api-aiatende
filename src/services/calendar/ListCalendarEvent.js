const AuthCalendar = require('../../utils/AuthCalendar');
const { google } = require('googleapis');
const GetAccessToken = require('../kommo/GetAccessToken');
const GetCustomFields = require('../kommo/GetCustomFields');
const UpdateLead = require('../kommo/UpdateLead');
const HandlingError = require('../kommo/HandlingError');
const GetUser = require('../kommo/GetUser');

function Calendar(calendarId) {
  const auth = AuthCalendar.authenticate();
  auth.authorize((err) => {
    if (err) {
      console.error('Erro na autenticação:', err);
      throw new Error('Erro na autenticação');
    }
    console.log('Listando eventos...');
    const calendar = google.calendar({ version: 'v3', auth });
    console.log('calendar:', calendar);
    calendar.events.list(
      {
        calendarId: calendarId,
        timeMin: new Date().toISOString(),
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime',
      },
      (err, result) => {
        if (err) {
          console.error('Erro ao listar eventos do calendário:', err);
          throw new Error('Erro ao listar eventos do calendário');
        }
        const events = result.data.items;
        if (events.length) {
          let string = '';
          string += 'Eventos encontrados:\n';
          events.map((event) => {
            const start = new Date(event.start.dateTime).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            string += `${start} - ${event.summary}\n`;
            // Calculo para pegar a duracao do evento
            const startDate = new Date(event.start.dateTime);
            const endDate = new Date(event.end.dateTime);
            let duration = (endDate - startDate) / 60000;
            if (duration >= 60) {
              duration = `${Math.floor(duration / 60)}h${duration % 60}m`;
            }
            string += `Duração: ${duration} minutos\n\n`;
          });
          console.log(string);
          return string;
        } else {
          throw new Error('Nenhum evento encontrado.');
        }
      }
    );
  });
}

const ListCalendarEvent = async (payload, access_token = null) => {
  let eventData = [];
  let custom_fields, filledDates;

  const calendarId = {
    juliana: 'ff3376c2855b6c18044adc7017c77b2f41177f1705a27f850339f91568c468fb@group.calendar.google.com',
    dentistas: 'clinicadentalsante@gmail.com'
  };

  const user = await GetUser(payload, false, access_token);
  const motivo = user?.custom_fields_values?.filter(field => field.field_name === 'Motivo Consulta')[0];

  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }
    custom_fields = await GetCustomFields(payload, access_token);

    filledDates = custom_fields?.filter(field => field.name === 'Datas ocupadas')[0];

    eventData = motivo?.values[0]?.value === 'Consulta Inicial' ? Calendar(calendarId.juliana) : Calendar(calendarId.dentistas);

    const reqBody = {
      'custom_fields_values': [
        {
          'field_id': filledDates?.id,
          'values': [
            {
              'value': eventData
            }
          ]
        }
      ]
    };
    await UpdateLead(payload, reqBody, access_token);
    console.log('Eventos listados com sucesso!');
  } catch (error) {
    try {
      eventData = motivo?.values[0]?.value === 'Consulta Inicial' ? Calendar(calendarId.juliana) : Calendar(calendarId.dentistas);

      const reqBody = {
        'custom_fields_values': [
          {
            'field_id': filledDates?.id,
            'values': [
              {
                'value': eventData
              }
            ]
          }
        ]
      };
      await UpdateLead(payload, reqBody, access_token);
      console.log('Eventos listados com sucesso!');
    } catch {
      if (error.response) {
        console.log(`Erro ao listar eventos no Google Calendar: ${error.response.data}`);
        await HandlingError(payload, access_token, `Erro ao listar eventos no Google Calendar: ${error.response.data}`);
      } else {
        console.log(`Erro ao listar eventos no Google Calendar: ${error.message}`);
        await HandlingError(payload, access_token, `Erro ao listar eventos no Google Calendar: ${error.message}`);
      }
      throw new Error('Erro no ListCalendarEvents');
    }
  }
};

module.exports = ListCalendarEvent;