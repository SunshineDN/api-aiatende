const axios = require('axios');
const GetAccessToken = require('../kommo/GetAccessToken');
const GetUser = require('../kommo/GetUser');
const GetCustomFields = require('../kommo/GetCustomFields');
const UpdateLead = require('../kommo/UpdateLead');

const RemoveCalendarEvent = async (payload, access_token = null) => {

  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    const eventId = user?.custom_fields.filter(field => field.name === 'Event ID')[0];

    const eventLink = custom_fields.filter(field => field.name === 'Event Link')[0];
    const eventIdField = custom_fields.filter(field => field.name === 'Event ID')[0];
    const eventSummary = custom_fields.filter(field => field.name === 'Event Summary')[0];
    const eventStart = custom_fields.filter(field => field.name === 'Event Start')[0];
    const eventFilled = custom_fields.filter(field => field.name === 'Datas ocupadas')[0];
    const eventAvaiable = custom_fields.filter(field => field.name === 'Datas disponíveis')[0];

    console.log('ID do Evento:', eventId?.values[0]?.value);

    try {
      console.log('Primeira tentativa de remover evento no calendário...');
      await axios.delete(`https://googlecalendar.api.institutodentalsante.com.br/delete/${eventId?.values[0]?.value}`).then(() => {
        console.log('Resposta vinda da API do Google Calendar: Evento deletado!');
      }).catch((error) => {
        console.log('Erro ao remover o evento no calendário:', error);
        throw new Error(error);
      });
    } catch {
      try {
        console.log('Segunda tentativa de remover evento no calendário...');
        await axios.delete(`https://googlecalendar.api.institutodentalsante.com.br/delete/${eventId?.values[0]?.value}`).then(() => {
          console.log('Resposta vinda da API do Google Calendar: Evento deletado!');
        }).catch((error) => {
          console.log('Erro ao remover o evento no calendário:', error);
          throw new Error(error);
        });
      } catch (error) {
        console.log('Erro ao remover o evento no calendário:', error);
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
    console.log('Erro no serviço RemoveCalendarEvent:', error);
    throw new Error(error);
  };
};

module.exports = RemoveCalendarEvent;
