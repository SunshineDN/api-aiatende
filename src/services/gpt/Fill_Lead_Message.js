const GetAccessToken = require('../kommo/GetAccessToken');
const GetCustomFields = require('../kommo/GetCustomFields');
const GetUser = require('../kommo/GetUser');
const UpdateLead = require('../kommo/UpdateLead');

const Fill_Lead_Message = async (payload, access_token = null) => {
  console.log('Função Fill_Lead_Message');
  let lastMessages, message, log;
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    lastMessages = custom_fields.filter(field => field.name === 'GPT | Last messages')[0];
    log = custom_fields.filter(field => field.name === 'GPT | LOG')[0];
    const leadMessage_isFilled = user?.custom_fields_values?.filter(field => field.field_name === 'GPT | Last messages')[0];

    if (leadMessage_isFilled?.values[0]?.value) {
      const messageSplit = leadMessage_isFilled?.values[0]?.value.split('\n');
      const sortedMessage = messageSplit?.reverse();
      const filterMessage = sortedMessage.filter((_, index) => index < 2);
      message = `${filterMessage.reverse().join('\n')}
${payload.text_audio.replace(/\+/g, ' ')}`;
    } else {
      message = payload.text_audio.replace(/\+/g, ' ');
    }

    const data = {
      'custom_fields_values': [
        {
          'field_id': lastMessages.id,
          'values': [
            {
              'value': message
            }
          ]
        },
      ],
    };

    await UpdateLead(payload, data, access_token);

    console.log('Preenchido mensagem do lead:', message);
  } catch (e) {
    let error;
    if (e.response) {
      error = e.response.data;
      console.log('Erro ao setar últimas mensagens do lead:', e.response.data);
    } else {
      error = e.message;
      console.log('Erro ao setar últimas mensagens do lead:', e.message);
    }

    const reqBody = {
      'custom_fields_values': [
        {
          'field_id': log?.id,
          'values': [
            {
              'value': `Erro ao setar últimas mensagens do lead: ${error}`
            }
          ]
        }
      ]
    };
    await UpdateLead(payload, reqBody, access_token);
    throw error;
  }
};

module.exports = Fill_Lead_Message;
