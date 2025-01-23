import { CalendarId } from '../../config/calendarId.js';

export const CalendarIdValidate = (condition = null) => {
  if (condition.includes('Juliana Leite')) {
    return CalendarId.juliana;
  } else if (condition.includes('Lucília Miranda') || condition.includes('Odontopediatria')) {
    return CalendarId.odontopediatria;
  } else {
    return CalendarId.dentistas;
  }
};