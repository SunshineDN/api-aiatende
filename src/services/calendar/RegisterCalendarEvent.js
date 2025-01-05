import { parse } from 'date-fns';
import styled from '../../utils/log/styledLog.js';
import { CalendarIdValidate } from '../../utils/calendar/CalendarIdValidate.js';
import { GetCustomFields } from '../kommo/GetCustomFields.js';
import { UpdateLead } from '../kommo/UpdateLead.js';
import { GetUser } from '../kommo/GetUser.js';
import { CalendarUtils } from '../../utils/calendar/CalendarUtils.js';
import { HandlingError } from '../kommo/HandlingError.js';

export const RegisterCalendarEvent = async (payload, access_token = null) => {
  const CalendarUtilsClass = new CalendarUtils();

  try {
    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    // console.log('Usuário:');
    // console.dir(user, { depth: null });

    const eventSummary = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Event Summary'
    )[0];
    const eventStart = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Event Start'
    )[0];
    const nameDoctor = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Dentista'
    )[0];

    const eventLink = custom_fields?.filter(
      (field) => field.name === 'Event Link'
    )[0];
    const eventID = custom_fields?.filter(
      (field) => field.name === 'Event ID'
    )[0];
    const dataAgendamento = custom_fields?.filter(
      (field) => field.name === 'Data do Agendamento'
    )[0];

    styled.info('Sumário:', eventSummary?.values[0]?.value);
    styled.info('Inicio do Evento:', eventStart?.values[0]?.value);

    let eventData = {};

    styled.info('Adicionando evento...');
    //console.log(req.body);
    // const { summary, description, start, ...rest } = req.body;
    const summary = eventSummary?.values[0]?.value;
    const startDateTime = parse(
      eventStart?.values[0]?.value,
      'dd/MM/yyyy HH:mm',
      new Date()
    );
    startDateTime.setHours(startDateTime.getHours() + 3);
    let endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);
    styled.info('summary:', summary);
    styled.info('startDateTime:', startDateTime);
    styled.info('endDateTime:', endDateTime);

    const schedule_date_hour_to_ms = startDateTime.getTime();
    const schedule_date_in_ms = Math.round(schedule_date_hour_to_ms / 1000);

    const event = {
      summary,
      //description,
      start: {
        dateTime: startDateTime,
      },
      end: {
        dateTime: endDateTime,
      },
      //...rest,
    };
    styled.info('Evento:', event);

    try {
      eventData = await CalendarUtilsClass.executeRegisterEvent( CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado'), event);
    } catch {
      eventData = await CalendarUtilsClass.executeRegisterEvent( CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado'), event);
    }

    styled.info('Dados do Evento (eventData):', eventData);
    const reqBody = {
      custom_fields_values: [
        {
          field_id: eventID?.id,
          values: [
            {
              value: eventData?.id,
            },
          ],
        },
        {
          field_id: eventLink?.id,
          values: [
            {
              value: eventData?.htmlLink,
            },
          ],
        },
        {
          field_id: dataAgendamento?.id,
          values: [
            {
              value: schedule_date_in_ms,
            },
          ],
        },
      ],
    };
    styled.info('Dados do corpo da requisição (reqBody):', reqBody);
    styled.info('Atualizando lead...');

    await UpdateLead(payload, reqBody, access_token);
    styled.success('Evento registrado com sucesso!');
  } catch (error) {
    if (error.response) {
      styled.error(
        `Erro ao registrar evento no Google Calendar: ${error.response.data}`
      );
      await HandlingError(
        payload,
        access_token,
        `Erro ao registrar evento no Google Calendar: ${error.response.data}`
      );
    } else {
      styled.error(
        `Erro ao registrar evento no Google Calendar: ${error.message}`
      );
      await HandlingError(
        payload,
        access_token,
        `Erro ao registrar evento no Google Calendar: ${error.message}`
      );
    }
    throw new Error(`erro no RegisterCalendarEvent: ${error}`);
  }
};