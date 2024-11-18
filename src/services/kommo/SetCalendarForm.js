const updateLead = require('./UpdateLead');
const getCustomFields = require('./GetCustomFields');
const HandlingError = require('./HandlingError');
const EncryptId = require('../../utils/EncryptId');

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
              'value': 'https://formulariotest.com/' + EncryptId(payload?.lead_id),
            }
          ]
        }
      ]
    };

    await updateLead(payload, reqBody, access_token);
  } catch (error) {
    if (error.response) {
      console.log(`Erro ao setar formulario de calendário: ${error.response.data}`);
      await HandlingError(payload, access_token, `Erro ao setar formulario de calendário: ${error.response.data}`);
    } else {
      console.log(`Erro ao setar formulario de calendário: ${error.message}`);
      await HandlingError(payload, access_token, `Erro ao setar formulario de calendário: ${error.message}`);
    }
  }
};

module.exports = SetCalendarFormService;
