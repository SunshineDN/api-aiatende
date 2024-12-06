const updateLead = require('./UpdateLead');
const getCustomFields = require('./GetCustomFields');
const HandlingError = require('./HandlingError');
const encryptId = require('../../utils/crypt/EncryptId');
const styled = require('../../utils/log/styledLog');

const SetCalendarFormService = async (payload, access_token) => {
  try {
    const custom_fields = await getCustomFields(payload, access_token);
    const calendar_form = custom_fields?.filter(
      (field) => field.name === 'Calendário'
    )[0];

    const reqBody = {
      'custom_fields_values': [
        {
          'field_id': calendar_form?.id,
          'values': [
            {
              'value': 'https://formulariotest.com/' + encryptId(payload?.lead_id),
            }
          ]
        }
      ]
    };

    await updateLead(payload, reqBody, access_token);
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

module.exports = SetCalendarFormService;
