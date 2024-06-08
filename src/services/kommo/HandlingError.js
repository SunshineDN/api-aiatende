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
    console.log('Erro setado no LOG com sucesso!');
    return;
  } catch (e) {
    console.log('Erro ao tratar erro:', e);
    throw new Error('Erro ao tratar no HandlingError');
  }
};

module.exports = HandlingError;
