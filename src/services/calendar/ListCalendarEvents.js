import styled from '../../utils/log/styled.js';
import { GetUser } from '../kommo/GetUser.js';
import { CalendarUtils } from '../../utils/calendar/CalendarUtils.js';
import { CalendarIdValidate } from '../../utils/calendar/CalendarIdValidate.js';
import { GetCustomFields } from '../kommo/GetCustomFields.js';
import { UpdateLead } from '../kommo/UpdateLead.js';
import { HandlingError } from '../kommo/HandlingError.js';

export const ListCalendarEvents = async (payload, access_token = null) => {
  let eventData, custom_fields, filledDates, user, nameDoctor;
  try{
    const CalendarUtilsClass = new CalendarUtils();
    user = await GetUser(payload, false, access_token);
      
    nameDoctor = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Dentista'
    )[0];
  
    custom_fields = await GetCustomFields(payload, access_token);
  
    filledDates = custom_fields?.filter(
      (field) => field.name === 'Datas ocupadas'
    )[0];
    try {
      eventData = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado'));
    } catch {
      eventData = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado'));
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