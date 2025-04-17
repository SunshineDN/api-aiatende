import styled from '../../utils/log/styled.js';
import OpenAIController from '../../controllers/OpenAIController.js';
import { GetAccessToken } from '../kommo/GetAccessToken.js';
import { GetCustomFields } from '../kommo/GetCustomFields.js';
import { UpdateLead } from '../kommo/UpdateLead.js';
import { GetUser } from '../kommo/GetUser.js';
import { Fill_Lead_Message } from './Fill_Lead_Message.js';
import { HandlingError } from '../kommo/HandlingError.js';

export const SpeechToText = async (payload, access_token = null) => {
  // console.log('Função SpeechToText');
  try {
    if (!access_token) {
      access_token = GetAccessToken()
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
    styled.info('Mensagem transcrita:', transcription);
    const last_message = {
      type: 'voice',
      text_audio: transcription
    };
    await Fill_Lead_Message(payload, last_message, access_token);
    const filled_message_received = message_received?.values[0]?.value?.split('\n') || [];
    const unique_messages = [...new Set(filled_message_received)];
    const message = `${unique_messages || ''}\n${transcription}`;

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
    styled.success('Lead atualizado com mensagem transcrita');
    return;
  } catch (error) {
    styled.error('Erro ao transcrever mensagem de áudio:', error);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao transcrever mensagem de áudio: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao transcrever mensagem de áudio: ${error.message}`);
    }
    throw new Error('Erro no SpeechToText');
  }
};