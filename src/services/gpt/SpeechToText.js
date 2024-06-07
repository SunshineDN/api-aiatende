// const axios = require('axios');
const GetAccessToken = require('../kommo/GetAccessToken');
const GetCustomFields = require('../kommo/GetCustomFields');
const GetUser = require('../kommo/GetUser');
const UpdateLead = require('../kommo/UpdateLead');
const OpenAIController = require('../../controllers/OpenAIController');

const SpeechToText = async (payload, access_token = null) => {
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    console.log('Função SpeechToText');
    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);
    const { text_audio, lead_id } = payload;

    const message_received = user?.custom_fields_values.filter(field => field.field_name === 'GPT | Message received')[0];

    // const URL = 'https://gpt.aiatende.com.br/audio-to-text';
    // const data = {
    //   audio_link: text_audio,
    //   lead_id
    // };
    // const { data: response } = await axios.post(URL, data);

    const message_received_field = custom_fields.filter(field => field.name === 'GPT | Message received')[0];

    const transcription = await OpenAIController.audioToText(text_audio, lead_id);
    console.log('Mensagem transcrita:', transcription);

    const message = `${message_received?.values[0]?.value || ''}\n${transcription}`;

    const kommoData = {
      'custom_fields_values': [
        {
          'field_id': message_received_field?.id,
          'values': [
            {
              'value': message
            }
          ]
        }
      ]
    };
    await UpdateLead(payload, kommoData, access_token);
    console.log('Lead atualizado com mensagem transcrita');
    return;

  } catch (error) {
    console.log('Erro ao transcrever mensagem de áudio:', error);
    throw error;
  }
};

module.exports = SpeechToText;
