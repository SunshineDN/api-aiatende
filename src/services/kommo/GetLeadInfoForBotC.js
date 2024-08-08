const GetAccessToken = require('./GetAccessToken');
const GetUser = require('./GetUser');

const GetLeadInfoForBotC = async (payload, access_token = null) => {
  console.log('Função GetLeadInfoForBotC!');
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }
    const user = await GetUser(payload, false, access_token);
    const nome = user?.custom_fields_values?.filter(field => field.field_name === 'Nome Completo')[0];
    const plano = user?.custom_fields_values?.filter(field => field.field_name === 'Plano (Texto)')[0];
    const telefone = user?.custom_fields_values?.filter(field => field.field_name === 'Telefone (Texto)')[0];

    return {
      nome: nome?.values[0]?.value || '',
      plano: plano?.values[0]?.value || '',
      telefone: telefone?.values[0]?.value || ''
    };
  } catch (error) {
    throw new Error(`Erro ao buscar informações do lead: ${error.message}`);
  }
};

module.exports = GetLeadInfoForBotC;
