// const axios = require('axios');
const GetAccessToken = require('../kommo/GetAccessToken');
const GetCustomFields = require('../kommo/GetCustomFields');
const GetUser = require('../kommo/GetUser');
const UpdateLead = require('../kommo/UpdateLead');
const OpenAIController = require('../../controllers/OpenAIController');
const HandlingError = require('../kommo/HandlingError');
const Fill_Lead_Message = require('./Fill_Lead_Message');

const SpeechToText = async (payload, access_token = null) => {
  // console.log('Função SpeechToText');
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);
    const { text_audio, lead_id } = payload;

    const message_received = user?.custom_fields_values?.filter(field => field.field_name === 'GPT | Message received')[0];
    const channel = user?.custom_fields_values?.filter(field => field.field_name === 'CANAL DE ENTRADA')[0];

    // const URL = 'https://gpt.aiatende.com.br/audio-to-text';
    // const data = {
    //   audio_link: text_audio,
    //   lead_id
    // };
    // const { data: response } = await axios.post(URL, data);

    const message_received_field = custom_fields?.filter(field => field.name === 'GPT | Message received')[0];
    const send_audio_field = custom_fields?.filter(field => field.name === 'GPT | Sent Audio')[0];

    const transcription = await OpenAIController.audioToText(text_audio, lead_id);
    console.log('Mensagem transcrita:', transcription);
    const last_message = {
      type: 'voice',
      text_audio: transcription
    }
    await Fill_Lead_Message(payload, last_message, access_token);
    const message = `${message_received?.values[0]?.value || ''}\n${transcription}`;

    let kommoData;


    if (channel?.values[0]?.value === '01 - WHATSAPP LITE') {
      kommoData = {
        'custom_fields_values': [
          {
            'field_id': message_received_field?.id,
            'values': [
              {
                'value': message
              }
            ]
          },
          {
            'field_id': send_audio_field?.id,
            'values': [
              {
                'value': true // Alterar para true para enviar áudio VIA WHATSAPP
              }
            ]
          }
        ]
      };
    } else {
      kommoData = {
        'custom_fields_values': [
          {
            'field_id': message_received_field?.id,
            'values': [
              {
                'value': message
              }
            ]
          },
          {
            'field_id': send_audio_field?.id,
            'values': [
              {
                'value': false
              }
            ]
          }
        ]
      };
    }
    await UpdateLead(payload, kommoData, access_token);
    console.log('Lead atualizado com mensagem transcrita');
    return;
  } catch (error) {
    if (error.response) {
      console.log(`Erro ao transcrever mensagem de áudio: ${error.response.data}`);
      await HandlingError(payload, access_token, `Erro ao transcrever mensagem de áudio: ${error.response.data}`);
    } else {
      console.log(`Erro ao transcrever mensagem de áudio: ${error.message}`);
      await HandlingError(payload, access_token, `Erro ao transcrever mensagem de áudio: ${error.message}`);
    }
    throw new Error('Erro no SpeechToText');
  }
};

module.exports = SpeechToText;
