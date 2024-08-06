const axios = require('axios');
const GetAccessToken = require('./GetAccessToken');
const HandlingError = require('./HandlingError');

const UpdateLead = async (payload, data, access_token = null) => {
  console.log('Função UpdateLead');
  // console.log('Payload:', payload);
  // Example = {
  //   lead_id: '21627448',
  //   status_id: '69491503',
  //   pipeline_id: '8887659',
  //   account: {
  //     id: 31205035,
  //     subdomain: 'kommoatende',
  //     account_domain: 'https://kommoatende.kommo.com'
  //   }
  // }
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

    try {
      console.log('Tentando atualizar lead');
      await axios.patch(`${domain}/api/v4/leads/${lead_id}`, data, options);
    } catch {
      console.log('Erro ao atualizar lead, tentando novamente');
      await axios.patch(`${domain}/api/v4/leads/${lead_id}`, data, options);
    }
    console.log('Lead atualizado com sucesso!');
    return;
  } catch (error) {
    if (error.response) {
      console.log('Erro ao atualizar lead');
      console.dir(error.response.data, { depth: null });
      await HandlingError(payload, access_token, `Erro ao atualizar lead: ${error.response.data}`);
    } else {
      console.log(`Erro ao atualizar lead: ${error.message}`);
      await HandlingError(payload, access_token, `Erro ao atualizar lead: ${error.message}`);
    }
    throw new Error('Erro no UpdateLead');
  }
};

module.exports = UpdateLead;
