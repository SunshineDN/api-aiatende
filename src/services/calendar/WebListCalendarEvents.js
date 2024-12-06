const CalendarIdValidate = require('../../utils/calendar/CalendarIdValidate');
const HandlingError = require('../kommo/HandlingError');
const GetUser = require('../kommo/GetUser');
const CalendarUtils = require('../../utils/calendar/CalendarUtils');
const GetAccessToken = require('../kommo/GetAccessToken');
const styled = require('../../utils/log/styledLog');

const WebListCalendarEvents = async (payload) => {
  let access_token, user, reason, nameDoctor;
  try{
    access_token = await GetAccessToken(payload);

    const CalendarUtilsClass = new CalendarUtils(payload?.account?.id);
    user = await GetUser(payload, false, access_token);
      
    reason = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Motivo Consulta'
    )[0];

    if (reason?.values[0]?.value === 'Ortodontia | Invisalign') {
      nameDoctor = 'Dra. Juliana Leite';
    } else if (reason?.values[0]?.value === 'Kids | Crianças') {
      nameDoctor = 'Dra. Lucília Miranda';
    } else {
      nameDoctor = 'Dentista Isento';
    }

    try {
      return await CalendarUtilsClass.listWebAvailableDate(CalendarIdValidate(nameDoctor, payload?.account?.id));
    } catch {
      return await CalendarUtilsClass.listWebAvailableDate(CalendarIdValidate(nameDoctor, payload?.account?.id));
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
    throw new Error('Erro no WebListCalendarEventss');
  }
};

module.exports = WebListCalendarEvents;
