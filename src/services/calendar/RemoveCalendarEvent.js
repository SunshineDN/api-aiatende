const { google } = require('googleapis');
const AuthCalendar = require('../../utils/AuthCalendar');
const GetAccessToken = require('../kommo/GetAccessToken');
const GetCustomFields = require('../kommo/GetCustomFields');
const UpdateLead = require('../kommo/UpdateLead');
const HandlingError = require('../kommo/HandlingError');
const GetUser = require('../kommo/GetUser');

const RemoveCalendarEvent = async (payload, access_token = null) => {
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);


    const eventId = user?.custom_fields_values?.filter(field => field.field_name === 'Event ID')[0];

    const eventLink = custom_fields?.filter(field => field.name === 'Event Link')[0];
    const eventIdField = custom_fields?.filter(field => field.name === 'Event ID')[0];
    const eventSummary = custom_fields?.filter(field => field.name === 'Event Summary')[0];
    const eventStart = custom_fields?.filter(field => field.name === 'Event Start')[0];
    const eventFilled = custom_fields?.filter(field => field.name === 'Datas ocupadas')[0];
    const eventAvaiable = custom_fields?.filter(field => field.name === 'Datas disponíveis')[0];

    const auth = AuthCalendar.authenticate();
    console.log('Deletando evento...');

    console.log('ID do Evento:', eventId?.values[0]?.value);
    try {
      auth.authorize((err) => {
        if (err) {
          console.error('Erro na autenticação:', err);
          throw new Error('Erro na autenticação');
        }
        const calendar = google.calendar({ version: 'v3', auth });
        calendar.events.delete(
          {
            calendarId: 'clinicadentalsante@gmail.com',
            eventId,
          },
          (err, result) => {
            if (err) {
              console.error('Erro ao deletar evento:', err);
              throw new Error('Erro ao deletar evento');
            }
            console.log('Evento deletado com sucesso.');
            return result.data;
          });
      });

      const bodyReq = {
        'custom_fields_values': [
          {
            'field_id': eventLink?.id,
            'values': [
              {
                'value': ''
              }
            ]
          },
          {
            'field_id': eventIdField?.id,
            'values': [
              {
                'value': ''
              }
            ]
          },
          {
            'field_id': eventSummary?.id,
            'values': [
              {
                'value': ''
              }
            ]
          },
          {
            'field_id': eventStart?.id,
            'values': [
              {
                'value': ''
              }
            ]
          },
          {
            'field_id': eventFilled?.id,
            'values': [
              {
                'value': ''
              }
            ]
          },
          {
            'field_id': eventAvaiable?.id,
            'values': [
              {
                'value': ''
              }
            ]
          }
        ]
      };
  
      await UpdateLead(payload, bodyReq, access_token);
  
      console.log('Evento removido com sucesso!');
    } catch {
      auth.authorize((err) => {
        if (err) {
          console.error('Erro na autenticação:', err);
          throw new Error('Erro na autenticação');
        }
        const calendar = google.calendar({ version: 'v3', auth });
        calendar.events.delete(
          {
            calendarId: 'clinicadentalsante@gmail.com',
            eventId,
          },
          (err, result) => {
            if (err) {
              console.error('Erro ao deletar evento:', err);
              throw new Error('Erro ao deletar evento');
            }
            console.log('Evento deletado com sucesso.');
            return result.data;
          });
      });
      const bodyReq = {
        'custom_fields_values': [
          {
            'field_id': eventLink?.id,
            'values': [
              {
                'value': ''
              }
            ]
          },
          {
            'field_id': eventIdField?.id,
            'values': [
              {
                'value': ''
              }
            ]
          },
          {
            'field_id': eventSummary?.id,
            'values': [
              {
                'value': ''
              }
            ]
          },
          {
            'field_id': eventStart?.id,
            'values': [
              {
                'value': ''
              }
            ]
          },
          {
            'field_id': eventFilled?.id,
            'values': [
              {
                'value': ''
              }
            ]
          },
          {
            'field_id': eventAvaiable?.id,
            'values': [
              {
                'value': ''
              }
            ]
          }
        ]
      };
  
      await UpdateLead(payload, bodyReq, access_token);
  
      console.log('Evento removido com sucesso!');
    }

  } catch (error) {
    if (error.response) {
      console.log(`Erro ao remover evento no Google Calendar: ${error.response.data}`);
      await HandlingError(payload, access_token, `Erro ao remover evento no Google Calendar: ${error.response.data}`);
    } else {
      console.log(`Erro ao remover evento no Google Calendar: ${error.message}`);
      await HandlingError(payload, access_token, `Erro ao remover evento no Google Calendar: ${error.message}`);
    }
    throw new Error('Erro no RemoveCalendarEvent');
  };
};
module.exports = RemoveCalendarEvent;