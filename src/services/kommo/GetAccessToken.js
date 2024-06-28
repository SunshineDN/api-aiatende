require('dotenv').config();
const axios = require('axios');

const GetAccessToken = async (payload) => {
  console.log('Fução GetAccessToken');
  const { account: { id: account_id, subdomain } } = payload;
  try {
    const { data: { access_token } } = await axios.post('http://token-api_backend-token_1:3001/auth/access_token', {
      account_id
    });
    console.log('Token existente recebido');
    return access_token;
  } catch {
    try {
      const req = {
        account_id,
        subdomain,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        client_code: process.env.CLIENT_CODE,
        grant_type: 'authorization_code'
      };
      let access_token;
      if (process.env.NODE_ENV === 'production') {
        ({ data: { access_token } } = await axios.post('http://token-api_backend-token_1:3001/auth/access_token', req));
      } else {
        ({ data: { access_token } } = await axios.post('http://aiatende.com:3001/auth/access_token', req));
      }
      console.log('Token novo criado e recebido');
      return access_token;
    } catch (error) {
      if (error.response) {
        console.log('Erro ao adquirir tokens:', error.response.data);
      } else {
        console.log('Erro ao adquirir tokens:', error.message);
      }
      throw new Error('Erro no GetAccessToken');
    }
  }
};

module.exports = GetAccessToken;
