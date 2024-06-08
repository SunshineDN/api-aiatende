const axios = require('axios');
const GetAccessToken = require('./GetAccessToken');
const HandlingError = require('./HandlingError');

const GetUser = async (payload, with_contact = false, access_token = null) => {
  // let { id: leadID } = decodePayload(body);
  const { lead_id, account: { account_domain: domain } } = payload;
  // let leadID = decoded.status.id;
  console.log('ID do Lead:', lead_id);

  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    const { data: responseData } = await axios.get(`${domain}/api/v4/leads/${lead_id}?with=contacts`, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': `${domain}/api/v4/leads/${lead_id}?with=contacts`,
        // 'Cookie': 'session_id=' + sessionID + ';',
        'Authorization': `Bearer ${access_token}`,
      }
    });

    if (with_contact) {
      const userContact = responseData._embedded.contacts[0].id;
      const { data: completeUser } = await axios.get(`${domain}/api/v4/contacts/${userContact}`, {
        headers: {
          'Content-Type': 'application/json',
          'Referer': `${domain}/api/v4/contacts/${userContact}`,
          // 'Cookie': 'session_id=' + sessionID + ';',
          'Authorization': `Bearer ${access_token}`,
        }
      });

      responseData.contact = completeUser;
    }
    // console.log('Usuário:');
    // console.dir(responseData, { depth: null });
    return responseData;
  } catch (error) {
    if (error.response) {
      console.log('Erro ao pegar usuário:', error.response.data);
      await HandlingError(payload, access_token, error.response.data);
    } else {
      console.log('Erro ao pegar usuário:', error.message);
      await HandlingError(payload, access_token, error.message);
    }
    throw new Error('Erro no GetUser');
  }
};

module.exports = GetUser;
