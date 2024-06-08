const axios = require('axios');
const GetAccessToken = require('../kommo/GetAccessToken');
const GetCustomFields = require('../kommo/GetCustomFields');
const UpdateLead = require('../kommo/UpdateLead');
const HandlingError = require('../kommo/HandlingError');

const ListCalendarEvents = async (payload, access_token = null) => {
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    const custom_fields = await GetCustomFields(payload, access_token);

    const filledDates = custom_fields?.filter(field => field.name === 'Datas ocupadas')[0];

    let events = [];
    try {
      console.log('Primeira tentativa de listar eventos do calendário...');
      await axios.get('https://googlecalendar.api.institutodentalsante.com.br/list')
        .then((response) => {
          console.log('Resposta da API Google Calendar (AI Atende):', response.data);
          events = response.data;
        }).catch((error) => {
          throw new Error(error);
        });
    } catch {
      try {
        console.log('Segunda tentativa de listar eventos do calendário...');
        await axios.get('https://googlecalendar.api.institutodentalsante.com.br/list')
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
      console.log('Erro ao listar eventos no Google Calendar:', error.response.data);
      await HandlingError(payload, access_token, error.response.data);
    } else {
      console.log('Erro ao listar eventos no Google Calendar:', error.message);
      await HandlingError(payload, access_token, error.message);
    }
    throw new Error('Erro no ListCalendarEvents');
  }
};

module.exports = ListCalendarEvents;
