const axios = require('axios');
const GetAccessToken = require('./GetAccessToken');

const GetCustomFields = async (payload, access_token = null) => {
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
    return custom_fields;
  } catch (error) {
    console.log('Erro no serviço getCustomFields:', error);
    throw new Error(error);
  }
};

module.exports = GetCustomFields;
