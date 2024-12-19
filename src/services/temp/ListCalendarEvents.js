const axios = require('axios');
const GetAccessToken = require('../kommo/GetAccessToken.js');
const GetCustomFields = require('../kommo/GetCustomFields.js');
const UpdateLead = require('../kommo/UpdateLead.js');
const HandlingError = require('../kommo/HandlingError.js');

const ListCalendarEvents = async (payload, access_token = null) => {
  try {
    if (!access_token) {
      access_token = GetAccessToken()
    }

    const custom_fields = await GetCustomFields(payload, access_token);

    const filledDates = custom_fields?.filter(field => field.name === 'Datas ocupadas')[0];

    let events = [];
    try {
      console.log('Primeira tentativa de listar eventos do calendário...');
      await axios.get('http://calendar_api_calendar_api_1:3002/list')
        .then((response) => {
          console.log('Resposta da API Google Calendar (AI Atende):', response.data);
          events = response.data;
        }).catch((error) => {
          throw new Error(error);
        });
    } catch {
      try {
        console.log('Segunda tentativa de listar eventos do calendário...');
        await axios.get('http://calendar_api_calendar_api_1:3002/list')
          .then((response) => {
            console.log('Resposta da API Google Calendar (AI Atende):', response.data);
            events = response.data;
          }).catch((error) => {
            throw new Error(error);
          });
      } catch (error) {
        throw new Error(error);
      }
    }

    console.log('Eventos:', events);
    const reqBody = {
      'custom_fields_values': [
        {
          'field_id': filledDates?.id,
          'values': [
            {
              'value': events
            }
          ]
        }
      ]
    };
    await UpdateLead(payload, reqBody, access_token);
    console.log('Eventos listados com sucesso!');
  } catch (error) {
    if (error.response) {
      console.log(`Erro ao listar eventos no Google Calendar: ${error.response.data}`);
      await HandlingError(payload, access_token, `Erro ao listar eventos no Google Calendar: ${error.response.data}`);
    } else {
      console.log(`Erro ao listar eventos no Google Calendar: ${error.message}`);
      await HandlingError(payload, access_token, `Erro ao listar eventos no Google Calendar: ${error.message}`);
    }
    throw new Error('Erro no ListCalendarEvents');
  }
};

module.exports = ListCalendarEvents;
