const GetAccessToken = require('./GetAccessToken');
const GetCustomFields = require('./GetCustomFields');
const UpdateLead = require('./UpdateLead');

const HandlingError = async (payload, access_token = null, error) => {
  console.log('Função HandlingError');
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
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
    return;
  } catch (error) {
    console.log('Erro ao tratar erro:', error);
    throw new Error('Erro ao tratar no HandlingError');
  }
};

module.exports = HandlingError;
