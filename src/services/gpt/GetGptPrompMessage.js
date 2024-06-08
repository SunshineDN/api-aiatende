// const axios = require('axios');
const GetCustomFields = require('../kommo/GetCustomFields');
const UpdateLead = require('../kommo/UpdateLead');
const GetAccessToken = require('../kommo/GetAccessToken');
const GetUser = require('../kommo/GetUser');
const OpenAIController = require('../../controllers/OpenAIController');

const GetGptPromptMessage = async (payload, access_token = null) => {
  console.log('Função GetGptPromptMessage');
  let log;
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }
    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);
  
    const prompt = user?.custom_fields_values?.filter(field => field.field_name === 'GPT | Prompt')[0];
    const answerReceived = custom_fields.filter(field => field.name === 'GPT | Answer Received?')[0];
    const answer = custom_fields.filter(field => field.name === 'GPT | Answer')[0];
    log = custom_fields.filter(field => field.name === 'GPT | LOG')[0];

    // const { data: { message } } = await axios.post('https://gpt.aiatende.com.br/message', {
    //   text: prompt?.values[0]?.value,
    // });

    // console.log('Prompt:', prompt?.values[0]?.value);
    const { message } = await OpenAIController.promptMessage(prompt?.values[0]?.value);

    // console.log('Mensagem do prompt:', message);
    const reqBody = {
      'custom_fields_values': [
        {
          'field_id': answerReceived?.id,
          'values': [
            {
              'value': true
            }
          ]
        },
        {
          'field_id': answer?.id,
          'values': [
            {
              'value': message
            }
          ]
        }
      ]
    };
    await UpdateLead(payload, reqBody, access_token);
    console.log('Lead atualizado com mensagem do prompt');
    return;
  } catch (error) {
    console.log('Erro ao enviar mensagem de prompt:', error);

    const reqBody = {
      'custom_fields_values': [
        {
          'field_id': log?.id,
          'values': [
            {
              'value': `Erro ao enviar mensagem de prompt: ${error}`
            }
          ]
        }
      ]
    };
    await UpdateLead(payload, reqBody, access_token);
    throw error;
  }
};

module.exports = GetGptPromptMessage;
