import styled from '../../utils/log/styled.js';
import { GetAccessToken } from '../kommo/GetAccessToken.js';
import { GetCustomFields } from '../kommo/GetCustomFields.js';
import { GetUser } from '../kommo/GetUser.js';
import { UpdateLead } from '../kommo/UpdateLead.js';

export const Fill_Lead_Message = async (payload, message_obj, access_token = null) => {
  styled.function('Função Fill_Lead_Message');
  let lastMessages, message, str,log;
  try {
    if (!access_token) {
      access_token = GetAccessToken()
    }

    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    lastMessages = custom_fields.filter(field => field.name === 'GPT | Last messages')[0];
    log = custom_fields.filter(field => field.name === 'GPT | LOG')[0];
    const leadMessage_isFilled = user?.custom_fields_values?.filter(field => field.field_name === 'GPT | Last messages')[0];

    if (message_obj.type !== 'voice') {
      str = message_obj.text_audio.replace(/\+/g, ' ');
    } else {
      str = message_obj.text_audio;
    }

    if (leadMessage_isFilled?.values[0]?.value) {
      const messageSplit = leadMessage_isFilled?.values[0]?.value.split('\n');
      const sortedMessage = messageSplit?.reverse();
      const filterMessage = sortedMessage.filter((_, index) => index < 3);
      message = `${filterMessage.reverse().join('\n')}
${str}`;
      const filled_message = message.split('\n');
      const unique_messages = [...new Set(filled_message)];
      message = unique_messages.join('\n');
    } else {
      message = str;
    }

    const data = {
      'custom_fields_values': [
        {
          'field_id': lastMessages.id,
          'values': [
            {
              'value': message
            }
          ]
        },
      ],
    };

    await UpdateLead(payload, data, access_token);

    styled.info('Preenchido mensagem do lead:', message);
  } catch (e) {
    styled.error('Erro ao setar últimas mensagens do lead:', e);
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
              'value': `Erro ao setar últimas mensagens do lead: ${error}`
            }
          ]
        }
      ]
    };
    await UpdateLead(payload, reqBody, access_token);
    throw error;
  }
};