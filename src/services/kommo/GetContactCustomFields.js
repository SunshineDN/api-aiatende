const axios = require('axios');
const GetAccessToken = require('./GetAccessToken');
const HandlingError = require('./HandlingError');
const styled = require('../../utils/styledLog');

const GetContactCustomFields = async (payload, access_token = null) => {
  // console.log('Função GetContactCustomFields!');

  const { account: { account_domain: domain } } = payload;
  try {
    let custom_fields;
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }
    
    try {
      // console.log('Tentando pegar campos customizados do contato');
      ({ data: { _embedded: { custom_fields } } } = await axios.get(`${domain}/api/v4/contacts/custom_fields`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }));
    } catch {
      styled.warning('Erro ao pegar campos customizados do contato, tentando novamente');
      ({ data: { _embedded: { custom_fields } } } = await axios.get(`${domain}/api/v4/contacts/custom_fields`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }));
    }

    // console.log('Campos customizados adquiridos!');
    return custom_fields;
  } catch (error) {
    styled.error('Erro ao pegar campos customizados do contato:', error);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao pegar campos customizados: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao pegar campos customizados: ${error.message}`);
    }
    throw new Error('Erro no GetContactCustomFields');
  }
};

module.exports = GetContactCustomFields;
