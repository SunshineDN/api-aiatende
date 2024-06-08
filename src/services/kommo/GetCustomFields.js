const axios = require('axios');
const GetAccessToken = require('./GetAccessToken');
const HandlingError = require('./HandlingError');

const GetCustomFields = async (payload, access_token = null) => {
  console.log('Função GetCustomFields!');

  const { account: { account_domain: domain } } = payload;
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }
    const { data: { _embedded: { custom_fields } } } = await axios.get(`${domain}/api/v4/leads/custom_fields`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    console.log('Campos customizados adquiridos!');
    return custom_fields;
  } catch (error) {
    if (error.response) {
      console.log('Erro ao pegar os campos customizados:', error.response.data);
      await HandlingError(payload, access_token, error.response.data);
    } else {
      console.log('Erro ao pegar os campos customizados:', error.message);
      await HandlingError(payload, access_token, error.message);
    }
    throw new Error('Erro no GetCustomFields');
  }
};

module.exports = GetCustomFields;
