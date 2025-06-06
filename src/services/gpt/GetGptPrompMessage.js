import styled from '../../utils/log/styled.js';
import OpenAIController from '../../controllers/OpenAIController.js';
import { GetAccessToken } from '../kommo/GetAccessToken.js';
import { GetCustomFields } from '../kommo/GetCustomFields.js';
import { GetUser } from '../kommo/GetUser.js';
import { UpdateLead } from '../kommo/UpdateLead.js';

export const GetGptPromptMessage = async (payload, access_token = null) => {
  styled.info('Função GetGptPromptMessage');
  let log, onOff;
  try {
    if (!access_token) {
      access_token = GetAccessToken()
    }
    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);
  
    const prompt = user?.custom_fields_values?.filter(field => field.field_name === 'GPT | Prompt')[0];
    const answerReceived = custom_fields.filter(field => field.name === 'GPT | Answer Received?')[0];
    const answer = custom_fields.filter(field => field.name === 'GPT | Answer')[0];
    log = custom_fields.filter(field => field.name === 'GPT | LOG')[0];
    onOff = custom_fields.filter(field => field.name === 'GPT | On/Off')[0];

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
        },
        {
          'field_id': log?.id,
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
    styled.success('Lead atualizado com mensagem do prompt');
    return;
  } catch (e) {
    styled.error('Erro ao enviar mensagem para o prompt:', e);
    let error;
    if (e.response) {
      error = e.response.data;
    } else {
      error = e.message;
    }

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