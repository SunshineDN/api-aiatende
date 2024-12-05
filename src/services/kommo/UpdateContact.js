const axios = require('axios');
const HandlingError = require('./HandlingError');
const styled = require('../../utils/styledLog');

const UpdateContact = async (payload, contact_id, data, access_token = null) => {
  // console.log('Função UpdateContact');
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
  const { account: { subdomain } } = payload;
  const domain = `https://${subdomain}.kommo.com`;
  try {
    
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Referer': `${domain}/api/v4/contacts/${contact_id}`,
        'Authorization': `Bearer ${access_token}`,
      }
    };

    await axios.patch(`${domain}/api/v4/contacts/${contact_id}`, data, options);
    // console.log('Contato do Lead atualizado com sucesso!');
    return;
  } catch (error) {
    styled.error('Erro ao atualizar contato do lead:', error);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao atualizar contato do lead: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao atualizar contato do lead: ${error.message}`);
    }
    throw new Error('Erro no UpdateContact');
  }
};

module.exports = UpdateContact;
