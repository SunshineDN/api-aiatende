import { GetAccessToken } from './GetAccessToken.js';
import { GetUser } from './GetUser.js';

export const GetAnswer = async (payload, access_token = null) => {
  // console.log('Função GetAnswer!');
  try {
    if (!access_token) {
      access_token = GetAccessToken()
    }
    const user = await GetUser(payload, false, access_token);
    const answer = user?.custom_fields_values?.filter(field => field.field_name === 'GPT | Answer')[0];
    return answer?.values[0]?.value;
  } catch (error) {
    throw new Error(`Erro ao buscar resposta: ${error.message}`);
  }
};