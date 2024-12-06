const GetCustomFields = require('./GetCustomFields');
const UpdateLead = require('./UpdateLead');
const GetAccessToken = require('./GetAccessToken');
const HandlingError = require('./HandlingError');
const styled = require('../../utils/log/styledLog');

const SendLog = async (payload, message, access_token = null) => {
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    const custom_fields = await GetCustomFields(payload, access_token);

    const log = custom_fields.filter(field => field.name === 'GPT | LOG')[0];

    const data = {
      'custom_fields_values': [
        {
          'field_id': log?.id,
          'values': [
            {
              'value': `${message}`
            }
          ]
        }
      ]
    };

    await UpdateLead(payload, data, access_token);
    return;
  } catch (error) {
    styled.error('Erro no SendLog:', error);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao setar log no SendLog: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao setar log no SendLog: ${error.message}`);
    }
    throw new Error('Erro no SendLog');
  }
};

module.exports = SendLog;
