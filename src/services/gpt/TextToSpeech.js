import styled from '../../utils/log/styledLog.js';
import OpenAIController from '../../controllers/OpenAIController.js';
import { GetAccessToken } from '../kommo/GetAccessToken.js';
import { GetCustomFields } from '../kommo/GetCustomFields.js';
import { GetUser } from '../kommo/GetUser.js';
import { UpdateLead } from '../kommo/UpdateLead.js';
import { HandlingError } from '../kommo/HandlingError.js';

export const TextToSpeech = async (payload, text, access_token = null) => {
  // console.log('Função TextToSpeech');
  try {
    if (!access_token) {
      access_token = GetAccessToken()
    }
    const user = await GetUser(payload, true, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    const user_sent_audio = user?.custom_fields_values?.filter(field => field.field_name === 'GPT | Sent Audio')[0];

    if (!user_sent_audio?.values[0]?.value) {
      styled.info('Lead não necessita de áudio');
      return;
    }
    
    const phoneField = user?.contact?.custom_fields_values?.filter(field => field.field_name === 'Phone' || field.field_name === 'Telefone')[0];
    const phone = phoneField?.values?.filter(value => value.enum_code === 'WORK')[0]?.value;
  
    // const gptAnswer = user?.custom_fields_values.filter(field => field.field_name === 'GPT | Answer')[0];
  
    const gptSentAudio = custom_fields?.filter(field => field.name === 'GPT | Sent Audio')[0];
    const gptAudioReceived = custom_fields?.filter(field => field.name === 'GPT | Audio Received?')[0];
    
    const voice_field = user?.custom_fields_values.filter(field => field.field_name === 'Voz')[0];
    const voice = voice_field?.values[0]?.value || 'shimmer';
  
    // const URL = 'https://gpt.aiatende.com.br/text-to-audio';
    // const data = {
    //   message: gptAnswer?.values[0]?.value,
    //   phone: phone
    // };
  
    
    // const response = await axios.post(URL, data);
    styled.info('Enviando áudio para o telefone:', phone);
    await OpenAIController.textToAudio(text, voice, phone, payload?.account?.subdomain);
    styled.success('Áudio enviado com sucesso!');

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
    styled.success('Audio enviado para o lead atualizado com sucesso!');
    return;
  } catch (error) {
    styled.error('Erro ao enviar mensagem de áudio:', error);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao enviar mensagem de áudio: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao enviar mensagem de áudio: ${error.message}`);
    }
    throw new Error(error);
  }
};