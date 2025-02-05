import { parse } from 'date-fns';
import styled from '../../utils/log/styled.js';
import { HandlingError } from '../kommo/HandlingError.js';
import { GetUser } from '../kommo/GetUser.js';
import { CalendarUtils } from '../../utils/calendar/CalendarUtils.js';
import { CalendarIdValidate } from '../../utils/calendar/CalendarIdValidate.js';

export const UpdateCalendarEvent = async (payload, access_token = null) => {
  let eventData, nameDoctor;
  const CalendarUtilsClass = new CalendarUtils();

  try {
    const user = await GetUser(payload, false, access_token);
    const eventSummary = user?.custom_fields_values?.filter(field => field.field_name === 'Event Summary')[0];
    const eventStart = user?.custom_fields_values?.filter(field => field.field_name === 'Event Start')[0];
    const eventId = user?.custom_fields_values?.filter(field => field.field_name === 'Event ID')[0];
    nameDoctor = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Profissional'
    )[0];
  
    styled.info('Sumário:', eventSummary?.values[0]?.value);
    styled.info('Inicio do Evento:', eventStart?.values[0]?.value);
    styled.info('ID do Evento:', eventId?.values[0]?.value);

    styled.info('Atualizando evento...');
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
      styled.info('Fim do Updated !');
      return resultUpdate;
    }catch{
      const resultUpdate = await CalendarUtilsClass.executeUpdateEvent(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado'), eventData);
      styled.info('Fim do Updated !');
      return resultUpdate;
    }
  }catch (error) {
    styled.error('Erro ao atualizar evento no Google Calendar:', error.message);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao atualizar evento no Google Calendar: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao atualizar evento no Google Calendar: ${error.message}`);
    }
    throw new Error('Erro no UpdateCalendarEvent');
  }
};