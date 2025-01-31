import axios from 'axios';
import styled from '../../utils/log/styled.js';
import { GetAccessToken } from './GetAccessToken.js';
import { HandlingError } from './HandlingError.js';

export const UpdateLead = async (payload, data, access_token = null) => {
  // console.log('Função UpdateLead');
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
      access_token = GetAccessToken()
    }
    
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Referer': `${domain}/api/v4/leads/${lead_id}`,
        'Authorization': `Bearer ${access_token}`,
      }
    };

    await axios.patch(`${domain}/api/v4/leads/${lead_id}`, data, options);
    // console.log('Lead atualizado com sucesso!');
    return;
  } catch (error) {
    styled.error('Error on UpdateLead:', error);
    if (error.response) {
      styled.errordir(error.response.data);
      await HandlingError(payload, access_token, `Erro ao atualizar lead: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao atualizar lead: ${error.message}`);
    }
    throw new Error('Erro no UpdateLead');
  }
};