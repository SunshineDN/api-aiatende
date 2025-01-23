const axios = require('axios');
const GetAccessToken = require('../kommo/GetAccessToken.js');
const GetUser = require('../kommo/GetUser.js');
const GetCustomFields = require('../kommo/GetCustomFields.js');
const UpdateLead = require('../kommo/UpdateLead.js');
const HandlingError = require('../kommo/HandlingError.js');

const RemoveCalendarEvent = async (payload, access_token = null) => {

  try {
    if (!access_token) {
      access_token = GetAccessToken()
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

    console.log('ID do Evento:', eventId?.values[0]?.value);

    try {
      console.log('Primeira tentativa de remover evento no calendário...');
      await axios.delete(`http://calendar_api_calendar_api_1:3002/delete/${eventId?.values[0]?.value}`).then(() => {
        console.log('Resposta vinda da API do Google Calendar: Evento deletado!');
      }).catch((error) => {
        throw new Error(error);
      });
    } catch {
      try {
        console.log('Segunda tentativa de remover evento no calendário...');
        await axios.delete(`http://calendar_api_calendar_api_1:3002/delete/${eventId?.values[0]?.value}`).then(() => {
          console.log('Resposta vinda da API do Google Calendar: Evento deletado!');
        }).catch((error) => {
          throw new Error(error);
        });
      } catch (error) {
        throw new Error(error);
      }
    }

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
