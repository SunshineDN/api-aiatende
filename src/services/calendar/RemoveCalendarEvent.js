import styled from '../../utils/log/styled.js';
import { CalendarIdValidate } from '../../utils/calendar/CalendarIdValidate.js';
import { GetCustomFields } from '../kommo/GetCustomFields.js';
import { UpdateLead } from '../kommo/UpdateLead.js';
import { GetUser } from '../kommo/GetUser.js';
import { HandlingError } from '../kommo/HandlingError.js';
import { CalendarUtils } from '../../utils/calendar/CalendarUtils.js';

export const RemoveCalendarEvent = async (payload, access_token = null) => {
  try {
    const CalendarUtilsClass = new CalendarUtils();

    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    const eventId = user?.custom_fields_values?.filter(field => field.field_name === 'ID do Evento')[0];

    const eventLink = custom_fields?.filter(field => field.name === 'Link do Evento')[0];
    const eventIdField = custom_fields?.filter(field => field.name === 'ID do Evento')[0];
    const eventSummary = custom_fields?.filter(field => field.name === 'Título do Evento')[0];
    const eventStart = custom_fields?.filter(field => field.name === 'Data do Evento')[0];
    const eventFilled = custom_fields?.filter(field => field.name === 'Datas ocupadas')[0];
    const eventAvaiable = custom_fields?.filter(field => field.name === 'Datas disponíveis')[0];
    const nameDoctor = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Profissional'
    )[0];

    styled.info('Deletando evento...');

    styled.info('ID do Evento:', eventId?.values[0]?.value);
    try {
      await CalendarUtilsClass.executeRemoveEvent(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado'), eventId?.values[0]?.value);
    } catch {
      try {
        await CalendarUtilsClass.executeRemoveEvent(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado'), eventId?.values[0]?.value);
      } catch (error) {
        styled.error('Erro ao remover evento no Google Calendar (2ª tentativa)');
        throw error;
      }
    }
    const bodyReq = {
      'custom_fields_values': [
        {
          'field_id': eventLink?.id,
          'values': [
            {
              'value': ''
            }
          ]
        },
        {
          'field_id': eventIdField?.id,
          'values': [
            {
              'value': ''
            }
          ]
        },
        {
          'field_id': eventSummary?.id,
          'values': [
            {
              'value': ''
            }
          ]
        },
        {
          'field_id': eventStart?.id,
          'values': [
            {
              'value': ''
            }
          ]
        },
        {
          'field_id': eventFilled?.id,
          'values': [
            {
              'value': ''
            }
          ]
        },
        {
          'field_id': eventAvaiable?.id,
          'values': [
            {
              'value': ''
            }
          ]
        }
      ]
    };

    await UpdateLead(payload, bodyReq, access_token);

    styled.success('Evento removido com sucesso!');

  } catch (error) {
    styled.error(`Erro ao remover evento no Google Calendar (última tentativa): ${error}`);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao remover evento no Google Calendar: ${error?.response?.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao remover evento no Google Calendar: ${error.message}`);
    }
    throw new Error('Erro no RemoveCalendarEvent');
  };
};