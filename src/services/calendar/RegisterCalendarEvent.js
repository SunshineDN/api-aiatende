const axios = require('axios');
const GetAccessToken = require('../kommo/GetAccessToken');
const GetUser = require('../kommo/GetUser');
const GetCustomFields = require('../kommo/GetCustomFields');
const UpdateLead = require('../kommo/UpdateLead');

const RegisterCalendarEvent = async (payload, access_token = null) => {
  console.log('Função RegisterCalendarEvent');
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    console.log('Usuário:');
    console.dir(user, { depth: null });

    const eventSummary = user?.custom_fields_values?.filter(field => field.field_name === 'Event Summary')[0];
    const eventStart = user?.custom_fields_values?.filter(field => field.field_name === 'Event Start')[0];

    const eventLink = custom_fields?.filter(field => field.name === 'Event Link')[0];
    const eventID = custom_fields?.filter(field => field.name === 'Event ID')[0];

    console.log('Sumário:', eventSummary?.values[0]?.value);
    console.log('Inicio do Evento:', eventStart?.values[0]?.value);

    let eventData = {};

    try {
      console.log('Primeira tentativa de registrar evento no calendário...');
      await axios.post('https://googlecalendar.api.institutodentalsante.com.br/add', {
        'summary': eventSummary?.values[0]?.value,
        'start': eventStart?.values[0]?.value
      }).then((response) => {
        console.log('Resposta da API Google Calendar (AI Atende):', response.data);
        eventData = response.data;
      }).catch((error) => {
        console.log('Erro ao registrar o evento no calendário:', error);
        throw new Error(error);
      });
    } catch {
      try {
        console.log('Segunda tentativa de registrar evento no calendário...');
        await axios.post('https://googlecalendar.api.institutodentalsante.com.br/add', {
          'summary': eventSummary?.values[0]?.value,
          'start': eventStart?.values[0]?.value
        }).then((response) => {
          console.log('Resposta da API Google Calendar (AI Atende):', response.data);
          eventData = response.data;
        }).catch((error) => {
          console.log('Erro ao registrar o evento no calendário:', error);
          throw new Error(error);
        });
      } catch (error) {
        console.log('Erro ao registrar o evento no calendário:', error);
        throw new Error(error);
      }
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
    console.log('Erro no serviço RegisterCalendarEvent:', error);
    throw new Error(error);
  }
};

module.exports = RegisterCalendarEvent;
