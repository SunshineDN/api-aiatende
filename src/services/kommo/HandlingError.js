import styled from '../../utils/log/styled.js';
import { GetAccessToken } from './GetAccessToken.js';
import { GetCustomFields } from './GetCustomFields.js';
import { UpdateLead } from './UpdateLead.js';

export const HandlingError = async (payload, access_token = null, error = '') => {
  // console.log('Função HandlingError');
  try {
    if (!access_token) {
      access_token = GetAccessToken()
    }
    const custom_fields = await GetCustomFields(payload, access_token);

    const log = custom_fields?.filter(field => field.name === 'GPT | LOG')[0];
    const data = {
      'custom_fields_values': [
        {
          'field_id': log?.id,
          'values': [
            {
              'value': `${error}`
            }
          ]
        }
      ]
    };
    await UpdateLead(payload, data, access_token);
    // console.log('Erro setado no LOG com sucesso!');
    return;
  } catch (e) {
    styled.error('Erro ao tratar erro no handler:', e);
    throw new Error('Erro ao tratar no HandlingError');
  }
};