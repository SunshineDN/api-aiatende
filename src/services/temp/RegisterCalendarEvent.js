const axios = require('axios');
const GetAccessToken = require('../kommo/GetAccessToken.js');
const GetUser = require('../kommo/GetUser.js');
const GetCustomFields = require('../kommo/GetCustomFields.js');
const UpdateLead = require('../kommo/UpdateLead.js');
const HandlingError = require('../kommo/HandlingError.js');

const RegisterCalendarEvent = async (payload, access_token = null) => {
  console.log('Função RegisterCalendarEvent');
  try {
    if (!access_token) {
      access_token = GetAccessToken()
    }

    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    // console.log('Usuário:');
    // console.dir(user, { depth: null });

    const eventSummary = user?.custom_fields_values?.filter(field => field.field_name === 'Título do Evento')[0];
    const eventStart = user?.custom_fields_values?.filter(field => field.field_name === 'Data do Evento')[0];

    const eventLink = custom_fields?.filter(field => field.name === 'Link do Evento')[0];
    const eventID = custom_fields?.filter(field => field.name === 'ID do Evento')[0];

    console.log('Sumário:', eventSummary?.values[0]?.value);
    console.log('Inicio do Evento:', eventStart?.values[0]?.value);

    let eventData = {};

    try {
      console.log('Primeira tentativa de registrar evento no calendário...');
      await axios.post('http://calendar_api_calendar_api_1:3002/add', {
        'summary': eventSummary?.values[0]?.value,
        'start': eventStart?.values[0]?.value
      }).then((response) => {
        console.log('Resposta da API Google Calendar (AI Atende):', response.data);
        eventData = response.data;
      }).catch((error) => {
        throw new Error(error);
      });
    } catch {
      try {
        console.log('Segunda tentativa de registrar evento no calendário...');
        await axios.post('http://calendar_api_calendar_api_1:3002/add', {
          'summary': eventSummary?.values[0]?.value,
          'start': eventStart?.values[0]?.value
        }).then((response) => {
          console.log('Resposta da API Google Calendar (AI Atende):', response.data);
          eventData = response.data;
        }).catch((error) => {
          throw new Error(error);
        });
      } catch (error) {
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
    if (error.response) {
      console.log(`Erro ao registrar evento no Google Calendar: ${error.response.data}`);
      await HandlingError(payload, access_token, `Erro ao registrar evento no Google Calendar: ${error.response.data}`);
    } else {
      console.log(`Erro ao registrar evento no Google Calendar: ${error.message}`);
      await HandlingError(payload, access_token, `Erro ao registrar evento no Google Calendar: ${error.message}`);
    }
    throw new Error('Erro no RegisterCalendarEvent');
  }
};

module.exports = RegisterCalendarEvent;
