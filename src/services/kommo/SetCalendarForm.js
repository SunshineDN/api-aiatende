import styled from '../../utils/log/styledLog.js';
import { UpdateLead } from './UpdateLead.js';
import { GetCustomFields } from './GetCustomFields.js';
import { HandlingError } from './HandlingError.js';
import { EncryptId } from '../../utils/crypt/EncryptId.js';

export const SetCalendarFormService = async (payload, access_token) => {
  try {
    const custom_fields = await GetCustomFields(payload, access_token);
    const calendar_form = custom_fields?.filter(
      (field) => field.name === 'Calendário'
    )[0];

    const reqBody = {
      'custom_fields_values': [
        {
          'field_id': calendar_form?.id,
          'values': [
            {
              'value': 'https://formulariotest.com/' + EncryptId(payload?.lead_id),
            }
          ]
        }
      ]
    };

    await UpdateLead(payload, reqBody, access_token);
  } catch (error) {
    styled.error('Error on SetCalendarFormService:', error);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao setar formulario de calendário: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao setar formulario de calendário: ${error.message}`);
    }
    throw new Error('Erro no SetCalendarFormService');
  }
};