const GetCustomFields = require('./GetCustomFields');
const UpdateLead = require('./UpdateLead');
const GetAccessToken = require('./GetAccessToken');
const HandlingError = require('./HandlingError');

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
    if (error.response) {
      console.log(`Erro ao setar log no SendLog: ${error.response.data}`);
      await HandlingError(payload, access_token, `Erro ao setar log no SendLog: ${error.response.data}`);
    } else {
      console.log(`Erro ao setar log no SendLog: ${error.message}`);
      await HandlingError(payload, access_token, `Erro ao setar log no SendLog: ${error.message}`);
    }
    throw new Error('Erro no SendLog');
  }
};

module.exports = SendLog;
