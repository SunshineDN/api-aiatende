const GetAccessToken = require('./GetAccessToken');
const GetUser = require('./GetUser');

const GetMessageReceived = async (payload, access_token = null) => {
  // console.log('Função GetMessageReceived!');
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }
    const user = await GetUser(payload, false, access_token);
    const message_received = user?.custom_fields_values?.filter(field => field.field_name === 'GPT | Message received')[0];
    return message_received?.values[0]?.value || 'ok';
  } catch (error) {
    throw new Error(`Erro ao buscar mensagem recebida: ${error.message}`);
  }
};

module.exports = GetMessageReceived;
