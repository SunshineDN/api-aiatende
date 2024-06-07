require('dotenv').config();
const axios = require('axios');

const GetAccessToken = async (payload) => {
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
      const { data: { access_token } } = await axios.post('http://token-api_backend-token_1:3001/auth/access_token', req);
      console.log('Token novo criado e recebido');
      return access_token;

    } catch (error) {
      console.log('Erro ao pegar token:', error);
      throw error;
    }
  }
};

module.exports = GetAccessToken;
