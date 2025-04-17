import axios from 'axios';
import styled from '../../utils/log/styled.js';
import { GetAccessToken } from './GetAccessToken.js';
import { HandlingError } from './HandlingError.js';

export const GetUser = async (payload, with_contact = false, access_token = null) => {
  // console.log('Função GetUser');
  const { lead_id, account: { account_domain: domain } } = payload;
  // console.log('ID do Lead:', lead_id);

  try {
    let responseData;
    if (!access_token) {
      access_token = GetAccessToken()
    }

    try {
      // console.log('Tentando pegar usuário');
      ({ data: responseData } = await axios.get(`${domain}/api/v4/leads/${lead_id}?with=contacts`, {
        headers: {
          'Content-Type': 'application/json',
          'Referer': `${domain}/api/v4/leads/${lead_id}?with=contacts`,
          // 'Cookie': 'session_id=' + sessionID + ';',
          'Authorization': `Bearer ${access_token}`,
        }
      }));
    } catch {
      styled.warning('Erro ao pegar usuário, tentando novamente');
      ({ data: responseData } = await axios.get(`${domain}/api/v4/leads/${lead_id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Referer': `${domain}/api/v4/leads/${lead_id}`,
          // 'Cookie': 'session_id=' + sessionID + ';',
          'Authorization': `Bearer ${access_token}`,
        }
      }));
    }

    if (with_contact) {
      let completeUser;
      const userContact = responseData._embedded.contacts[0].id;
      
      try {
        // console.log('Tentando pegar contato');
        ({ data: completeUser } = await axios.get(`${domain}/api/v4/contacts/${userContact}`, {
          headers: {
            'Content-Type': 'application/json',
            'Referer': `${domain}/api/v4/contacts/${userContact}`,
            // 'Cookie': 'session_id=' + sessionID + ';',
            'Authorization': `Bearer ${access_token}`,
          }
        }));
      } catch {
        styled.warning('Erro ao pegar contato, tentando novamente');
        ({ data: completeUser } = await axios.get(`${domain}/api/v4/contacts/${userContact}`, {
          headers: {
            'Content-Type': 'application/json',
            'Referer': `${domain}/api/v4/contacts/${userContact}`,
            // 'Cookie': 'session_id=' + sessionID + ';',
            'Authorization': `Bearer ${access_token}`,
          }
        }));
      }

      responseData.contact = completeUser;
    }
    // console.log('Usuário:');
    // console.dir(responseData, { depth: null });
    // console.log('Usuário obtido com sucesso');
    return responseData;
  } catch (error) {
    styled.error('Erro ao pegar usuário (GetUser):', error);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao pegar usuário: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao pegar usuário: ${error.message}`);
    }
    throw new Error('Erro no GetUser');
  }
};