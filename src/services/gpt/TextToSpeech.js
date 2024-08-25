// const axios = require('axios');
const GetCustomFields = require('../kommo/GetCustomFields');
const GetUser = require('../kommo/GetUser');
const GetAccessToken = require('../kommo/GetAccessToken');
const UpdateLead = require('../kommo/UpdateLead');
const OpenAIController = require('../../controllers/OpenAIController');
const HandlingError = require('../kommo/HandlingError');

const TextToSpeech = async (payload, text, access_token = null) => {
  // console.log('Função TextToSpeech');
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }
    const user = await GetUser(payload, true, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    const user_sent_audio = user?.custom_fields_values.filter(field => field.field_name === 'GPT | Sent Audio')[0];

    if (!user_sent_audio?.values[0]?.value) {
      console.log('Lead não necessita de áudio');
      return;
    }
    
    const phoneField = user?.contact?.custom_fields_values.filter(field => field.field_name === 'Phone')[0];
    const phone = phoneField?.values?.filter(value => value.enum_code === 'WORK')[0]?.value;
  
    // const gptAnswer = user?.custom_fields_values.filter(field => field.field_name === 'GPT | Answer')[0];
  
    const gptSentAudio = custom_fields.filter(field => field.name === 'GPT | Sent Audio')[0];
    const gptAudioReceived = custom_fields.filter(field => field.name === 'GPT | Audio Received?')[0];
    
    const voice_field = user?.custom_fields_values.filter(field => field.field_name === 'Voz')[0];
    const voice = voice_field?.values[0]?.value || 'shimmer';
  
    // const URL = 'https://gpt.aiatende.com.br/text-to-audio';
    // const data = {
    //   message: gptAnswer?.values[0]?.value,
    //   phone: phone
    // };
  
    console.log('Enviando áudio para o telefone:', phone);

    // const response = await axios.post(URL, data);
    await OpenAIController.textToAudio(text, voice, phone, payload?.account?.subdomain);
    console.log('Áudio enviado com sucesso!');

    const kommoData = {
      'custom_fields_values': [
        {
          'field_id': gptSentAudio?.id,
          'values': [
            {
              'value': false
            }
          ]
        },
        {
          'field_id': gptAudioReceived?.id,
          'values': [
            {
              'value': true
            }
          ]
        }
      ]
    };
    await UpdateLead(payload, kommoData, access_token);
    console.log('Audio enviado para o lead atualizado com sucesso!');
    return;
  } catch (error) {
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao enviar mensagem de áudio: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao enviar mensagem de áudio: ${error.message}`);
    }
    console.log('Erro ao enviar mensagem de áudio');
    throw new Error(error);
  }
};

module.exports = TextToSpeech;
