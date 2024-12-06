// const { google } = require('googleapis');
const CalendarIdValidate = require('../../utils/calendar/CalendarIdValidate');
const GetCustomFields = require('../kommo/GetCustomFields');
const UpdateLead = require('../kommo/UpdateLead');
const HandlingError = require('../kommo/HandlingError');
const GetUser = require('../kommo/GetUser');
const CalendarUtils = require('../../utils/calendar/CalendarUtils');
const styled = require('../../utils/log/styledLog');

const ListCalendarEvent = async (payload, access_token = null) => {
  let eventData, custom_fields, filledDates, user, nameDoctor;
  try{
    const CalendarUtilsClass = new CalendarUtils(payload?.account?.id);
    user = await GetUser(payload, false, access_token);
      
    nameDoctor = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Dentista'
    )[0];
  
    custom_fields = await GetCustomFields(payload, access_token);
  
    filledDates = custom_fields?.filter(
      (field) => field.name === 'Datas ocupadas'
    )[0];
    try {
      eventData = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado', payload?.account?.id));
    } catch {
      eventData = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado', payload?.account?.id));
    }
  }catch(error) {
    if (error.response) {
      styled.error(
        `Erro ao listar eventos no Google Calendar: ${error.response.data}`
      );
      await HandlingError(
        payload,
        access_token,
        `Erro ao listar eventos no Google Calendar: ${error.response.data}`
      );
    } else {
      styled.error(
        `Erro ao listar eventos no Google Calendar: ${error.message}`
      );
      await HandlingError(
        payload,
        access_token,
        `Erro ao listar eventos no Google Calendar: ${error.message}`
      );
    }
    throw new Error('Erro no ListCalendarEvents');
  }
  const reqBody = {
    custom_fields_values: [
      {
        field_id: filledDates?.id,
        values: [
          {
            value: eventData,
          },
        ],
      },
    ],
  };
  await UpdateLead(payload, reqBody, access_token);
  styled.info('Fim do ListCalendar!');
};

module.exports = ListCalendarEvent;
