const TextToSpeech = require('../gpt/TextToSpeech');
const GetCustomFields = require('./GetCustomFields');
const UpdateLead = require('./UpdateLead');

const SendMessage = async (body, audio, message, access_token) => {
  try {
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
    if (audio) {
      await TextToSpeech(body, message, access_token);
    }
    await UpdateLead(body, data, access_token);
    return;
  } catch (e) {
    console.log(e);
    let error;
    if (e.response) {
      error = e.response.data;
      console.log(`Erro no SendMessage: ${error.response.data}`);
    } else {
      error = e.message;
      console.log(`Erro no SendMessage: ${error}`);
    }
    throw new Error('Erro no SendMessage:', error);
  }
};

module.exports = SendMessage;
