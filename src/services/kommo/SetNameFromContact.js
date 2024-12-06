const styled = require('../../utils/log/styledLog');
const GetAccessToken = require('./GetAccessToken');
const GetCustomFields = require('./GetCustomFields');
const GetUser = require('./GetUser');
const HandlingError = require('./HandlingError');
const UpdateLead = require('./UpdateLead');

const SetNameFromContact = async (payload, access_token = null) => {
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    const user = await GetUser(payload, true, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    const name = user?.contact?.name;

    const name_field = custom_fields?.filter(field => field.name === 'Nome Completo')[0];

    const kommoData = {
      'custom_fields_values': [
        {
          'field_id': name_field?.id,
          'values': [
            {
              'value': name
            }
          ]
        }
      ]
    };
    await UpdateLead(payload, kommoData, access_token);
  } catch (error) {
    styled.error('Error on SetNameFromContact:', error);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao setar o nome do contato no campo NOME COMPLETO do card: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao setar o nome do contato no campo NOME COMPLETO do card: ${error.message}`);
    }
    throw new Error('Erro no SetNameFromContact');
  }
};

module.exports = SetNameFromContact;
