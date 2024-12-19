import axios from 'axios';

export const TokenizeTest = async (payload, access_token, res) => {
  console.log('Testando token!');
  try {
    console.log('Token: ' + access_token);
    const { lead_id, account: { account_domain: domain } } = payload;

    const { data: responseData } = await axios.get(`${domain}/api/v4/leads/${lead_id}?with=contacts`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      }
    });

    res.json(responseData);
  } catch (error) {
    throw new Error(error);
  }
};