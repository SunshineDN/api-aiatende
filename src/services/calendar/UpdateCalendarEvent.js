// const AuthCalendar = require('../../utils/AuthCalendar');
// const { google } = require('googleapis');
// const CalendarIdValidate = require('../../utils/CalendarIdValidate');
const { parse } = require('date-fns');
const HandlingError = require('../kommo/HandlingError');
const GetUser = require('../kommo/GetUser');
const CalendarUtils = require('../../utils/CalendarUtils');
const CalendarIdValidate = require('../../utils/CalendarIdValidate');

const UpdateCalendarEvent = async (payload, access_token = null) => {
  let eventData, nameDoctor;
  const CalendarUtilsClass = new CalendarUtils(payload?.account?.id);

  try {
    const user = await GetUser(payload, false, access_token);
    const eventSummary = user?.custom_fields_values?.filter(field => field.field_name === 'Event Summary')[0];
    const eventStart = user?.custom_fields_values?.filter(field => field.field_name === 'Event Start')[0];
    const eventId = user?.custom_fields_values?.filter(field => field.field_name === 'Event ID')[0];
    nameDoctor = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Dentista'
    )[0];
  
    console.log('Sumário:', eventSummary?.values[0]?.value);
    console.log('Inicio do Evento:', eventStart?.values[0]?.value);
    console.log('ID do Evento:', eventId?.values[0]?.value);

    console.log('Atualizando evento...');
    const startDateTime = parse(eventStart, 'dd/MM/yyyy HH:mm', new Date());
    let endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);
    eventData = {
      eventId: eventId?.values[0]?.value,
      eventSummary: eventSummary?.values[0]?.value,
      startDateTime,
      endDateTime
    };

    try {
      const resultUpdate = await CalendarUtilsClass.executeUpdateEvent(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado'), eventData);
      console.log('Fim do Updated !');
      return resultUpdate;
    }catch{
      const resultUpdate = await CalendarUtilsClass.executeUpdateEvent(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado'), eventData);
      console.log('Fim do Updated !');
      return resultUpdate;
    }
  }catch (error) {
    if (error.response) {
      console.log(`Erro ao atualizar evento no Google Calendar: ${error.response.data}`);
      await HandlingError(payload, access_token, `Erro ao atualizar evento no Google Calendar: ${error.response.data}`);
    } else {
      console.log(`Erro ao atualizar evento no Google Calendar: ${error.message}`);
      await HandlingError(payload, access_token, `Erro ao atualizar evento no Google Calendar: ${error.message}`);
    }
    throw new Error('Erro no UpdateCalendarEvent');
  }
};

module.exports = UpdateCalendarEvent;
