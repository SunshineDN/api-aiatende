import styled from '../../utils/log/styled.js';
import { CalendarIdValidate } from '../../utils/calendar/CalendarIdValidate.js';
import { HandlingError } from '../kommo/HandlingError.js';
import { GetUser } from '../kommo/GetUser.js';
import { GetAccessToken } from '../kommo/GetAccessToken.js';
import { CalendarUtils } from '../../utils/calendar/CalendarUtils.js';

export const WebListCalendarEvents = async (payload) => {
  let access_token, user, reason, nameDoctor;
  try{
    access_token = GetAccessToken()

    const CalendarUtilsClass = new CalendarUtils();
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
      return await CalendarUtilsClass.listWebAvailableDate(CalendarIdValidate(nameDoctor));
    } catch {
      return await CalendarUtilsClass.listWebAvailableDate(CalendarIdValidate(nameDoctor));
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
    throw new Error('Erro no WebListCalendarEvents');
  }
};