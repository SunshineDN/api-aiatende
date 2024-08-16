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
    const weekOptions = {
      timeZone: 'America/Recife',
      weekday: 'long'
    };
    const weekDay = date.toLocaleDateString('pt-BR', weekOptions);

    const actual_date_field = custom_fields.filter(field => field.name === 'GPT | Data e Hora Atual')[0];
    const actual_week_field = custom_fields.filter(field => field.name === 'GPT | Dia da Semana')[0];

    const kommoData = {
      'custom_fields_values': [
        {
          'field_id': actual_date_field?.id,
          'values': [
            {
              'value': actual_date_in_ms
            }
          ]
        },
        {
          'field_id': actual_week_field?.id,
          'values': [
            {
              'value': weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase()
            }
          ]
        }
      ]
    };
    await UpdateLead(payload, kommoData, access_token);
    // console.log('Sucesso ao setar data, hora e dia da semana');
  } catch (error) {
    if (error.response) {
      console.log(`Erro ao setar data, hora e dia da semana: ${error.response.data}`);
      await HandlingError(payload, access_token, `Erro ao setar data, hora e dia da semana: ${error.response.data}`);
    } else {
      console.log(`Erro ao setar data, hora e dia da semana: ${error.message}`);
      await HandlingError(payload, access_token, `Erro ao setar data, hora e dia da semana: ${error.message}`);
    }
    throw new Error('Erro no SetActualDataHour');
  }
};

module.exports = SetActualDateHour;
