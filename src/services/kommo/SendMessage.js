// const TextToSpeech = require('../gpt/TextToSpeech');
const styled = require('../../utils/styledLog');
const GetCustomFields = require('./GetCustomFields');
// const GetUser = require('./GetUser');
const UpdateLead = require('./UpdateLead');

const SendMessage = async (body, audio, message, access_token) => {
  try {
    // const user = await GetUser(body, false, access_token);
    
    // const canal_field = user?.custom_fields_values?.filter(field => field.field_name === 'CANAL DE ENTRADA')[0];
    // const canal = canal_field?.values[0]?.value;

    const custom_fields = await GetCustomFields(body, access_token);
    const answer = custom_fields?.filter(field => field.name === 'GPT | Answer')[0];
    const log = custom_fields?.filter(field => field.name === 'GPT | LOG')[0];
    const data = {
      'custom_fields_values': [
        {
          'field_id': answer?.id,
          'values': [
            {
              'value': `${message}`
            }
          ]
        },
        {
          'field_id': log?.id,
          'values': [
            {
              'value': 'ok'
            }
          ]
        }
      ]
    };
    // if (audio && canal !== '02 - WHATSAPP API' && canal !== '03 - REDE SOCIAL') {
    //   console.log('Lead precisa de áudio...');
    //   await TextToSpeech(body, message, access_token);
    // }
    await UpdateLead(body, data, access_token);
    return;
  } catch (e) {
    styled.error('Erro no SendMessage:', e);
    let error;
    if (e.response) {
      error = e.response.data;
    } else {
      error = e.message;
    }
    throw new Error('Erro no SendMessage:', error);
  }
};

module.exports = SendMessage;
