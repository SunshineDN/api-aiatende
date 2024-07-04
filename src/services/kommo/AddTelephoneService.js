const GetUser = require("./GetUser");


const addTelephoneService = async (payload,access_token) => {

    const user = await GetUser(payload,true,access_token);

    const telephone = user?.custom_fields_value.filter(field => field.field.name === "")[0];

}

module.exports = addTelephoneService;