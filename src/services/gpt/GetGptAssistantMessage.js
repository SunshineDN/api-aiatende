// const axios = require('axios');
const GetCustomFields = require('../kommo/GetCustomFields');
const GetAccessToken = require('../kommo/GetAccessToken');
const GetUser = require('../kommo/GetUser');
const UpdateLead = require('../kommo/UpdateLead');
const OpenAIController = require('../../controllers/OpenAIController');
const TextToSpeech = require('./TextToSpeech');

const GetGptAssistantMessage = async (payload, assistant_id, access_token = null) => {
  // console.log('Função GetGptAssistantMessage');
  let logField, onOff, answerReceived;
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    const leadID = user.id;
    const prompt = user?.custom_fields_values?.filter(field => field.field_name === 'GPT | Prompt')[0];
    answerReceived = custom_fields.filter(field => field.name === 'GPT | Answer Received?')[0];
    const answer = custom_fields.filter(field => field.name === 'GPT | Answer')[0];
    logField = custom_fields.filter(field => field.name === 'GPT | LOG')[0];
    onOff = custom_fields.filter(field => field.name === 'GPT | On/Off')[0];

    const sent_audio = user?.custom_fields_values?.filter(field => field.field_name === 'GPT | Sent Audio')[0];

    const data = {
      leadID,
      text: prompt?.values[0]?.value,
      assistant_id,
    };

    // const { data: { message } } = await axios.post(`https://gpt.aiatende.com.br/${assistant_id}/message`, {
    //   leadID,
    //   text: prompt?.values[0]?.value,
    // });

    const { message } = await OpenAIController.generateMessage(data);

    // console.log('Mensagem do assistente:', message);
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
        },
        {
          'field_id': logField?.id,
          'values': [
            {
              'value': 'ok'
            }
          ]
        },
        {
          'field_id': onOff?.id,
          'values': [
            {
              'value': false
            }
          ]
        }
      ]
    };

    await UpdateLead(payload, reqBody, access_token);

    if (sent_audio?.values[0].value === true) {
      await TextToSpeech(payload, access_token);
    }
    // console.log('Mensagem da assistente armazenada com sucesso!');
  } catch (e) {
    let error;
    if (e.response) {
      error = e.response.data;
      console.log('Erro ao enviar mensagem para o GPT Assistant:', e.response.data);
    } else {
      error = e.message;
      console.log('Erro ao enviar mensagem para o GPT Assistant:', e.message);
    }
    const reqBody = {
      'custom_fields_values': [
        {
          'field_id': logField?.id,
          'values': [
            {
              'value': `Erro ao enviar mensagem para o assistente: ${error}`
            }
          ]
        },
        {
          'field_id': answerReceived?.id,
          'values': [
            {
              'value': true
            }
          ]
        }
      ]
    };

    await UpdateLead(payload, reqBody, access_token);
    throw error;
  }
};

module.exports = GetGptAssistantMessage;
