const styled = require('../../utils/log/styledLog');
const GetAccessToken = require('./GetAccessToken');
const GetCustomFields = require('./GetCustomFields');
const HandlingError = require('./HandlingError');
const UpdateLead = require('./UpdateLead');

const SetActualDateHour = async (payload, access_token = null) => {
  try {
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    const custom_fields = await GetCustomFields(payload, access_token);
    const date = new Date();
    const actual_date_hour_to_ms = date.getTime();
    const actual_date_in_ms = Math.round(actual_date_hour_to_ms / 1000);

    // const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    // const weekOptions = {
    //   timeZone: 'America/Recife',
    //   weekday: 'long'
    // };
    // const weekDay = date.toLocaleDateString('pt-BR', weekOptions);

    const actual_date_field = custom_fields.filter(field => field.name === 'Quando foi agendado')[0];
    // const actual_week_field = custom_fields.filter(field => field.name === 'GPT | Dia da Semana')[0];

    const kommoData = {
      'custom_fields_values': [
        {
          'field_id': actual_date_field?.id,
          'values': [
            {
              'value': actual_date_in_ms
            }
          ]
        }
      ]
    };
    await UpdateLead(payload, kommoData, access_token);
  } catch (error) {
    styled.error('Error on SetActualDateHour:', error);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao setar data, hora e dia da semana: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao setar data, hora e dia da semana: ${error.message}`);
    }
    throw new Error('Erro no SetActualDataHour');
  }
};

module.exports = SetActualDateHour;
