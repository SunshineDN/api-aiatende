const axios = require('axios');
const GetAccessToken = require('../kommo/GetAccessToken');
const GetUser = require('../kommo/GetUser');
const HandlingError = require('../kommo/HandlingError');

const UpdateCalendarEvent = async (payload, access_token = null) => {
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }
    const user = await GetUser(payload, false, access_token);

    const eventSummary = user?.custom_fields_values?.filter(field => field.field_name === 'Event Summary')[0];
    const eventStart = user?.custom_fields_values?.filter(field => field.field_name === 'Event Start')[0];
    const eventId = user?.custom_fields_values?.filter(field => field.field_name === 'Event ID')[0];
  
    console.log('Sumário:', eventSummary?.values[0]?.value);
    console.log('Inicio do Evento:', eventStart?.values[0]?.value);
    console.log('ID do Evento:', eventId?.values[0]?.value);

    try {
      console.log('Primeira tentativa de atualizar evento no calendário...');
      await axios.patch(`http://calendar_api_calendar_api_1:3002/update/${eventId?.values[0]?.value}`, {
        'summary': eventSummary?.values[0]?.value,
        'start': eventStart?.values[0]?.value
      }).then((response) => {
        console.log('Resposta da API Google Calendar (AI Atende):', response.data);
      }).catch((error) => {
        throw new Error(error);
      });

    } catch {
      try {
        console.log('Segunda tentativa de atualizar evento no calendário...');
        await axios.patch(`http://calendar_api_calendar_api_1:3002/update/${eventId?.values[0]?.value}`, {
          'summary': eventSummary?.values[0]?.value,
          'start': eventStart?.values[0]?.value
        }).then((response) => {
          console.log('Resposta da API Google Calendar (AI Atende):', response.data);
        }).catch((error) => {
          throw new Error(error);
        });
      } catch (error) {
        throw new Error(error);
      }
    }
    console.log('Evento atualizado com sucesso!');

  } catch (error) {
    if (error.response) {
      console.log(`Erro ao atualizar evento no Google Calendar: ${error.response.data}`);
      await HandlingError(payload, access_token, `Erro ao atualizar evento no Google Calendar: ${error.response.data}`);
    } else {
      console.log(`Erro ao atualizar evento no Google Calendar: ${error.message}`);
      await HandlingError(payload, access_token, `Erro ao atualizar evento no Google Calendar: ${error.message}`);
    }
    throw new Error('Erro no UpdateCalendarEvent');
  };
};

module.exports = UpdateCalendarEvent;
