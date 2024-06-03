const axios = require('axios');
const GetAccessToken = require('./GetAccessToken');

const UpdateLead = async (payload, data, access_token = null) => {
  console.log('Payload:', payload);
  const { lead_id, account: { subdomain } } = payload;
  const domain = `https://${subdomain}.kommo.com`;

  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }
    
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Referer': `${domain}/api/v4/leads/${lead_id}`,
        'Authorization': `Bearer ${access_token}`,
      }
    };

    const { data: response } = await axios.patch(`${domain}/api/v4/leads/${lead_id}`, data, options);

    console.log('Resposta do Kommo:', response);
    return;
  } catch (error) {
    console.log('Erro ao atualizar lead:', error);
    throw error;
  }
};

module.exports = UpdateLead;
