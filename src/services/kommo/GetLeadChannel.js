const GetAccessToken = require("./GetAccessToken");
const GetUser = require("./GetUser");

const GetLeadChannel = async (payload, access_token = null) => {
  console.log('Função GetLeadChannel!');
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }
    const user = await GetUser(payload, false, access_token);
    const answer = user?.custom_fields_values?.filter(field => field.field_name === 'CONVERSA')[0];
    return answer?.values[0]?.value;
  } catch (error) {
    throw new Error('Erro no GetLeadChannel');
  }
}

module.exports = GetLeadChannel;