const CalendarId = require('../config/calendarId');

const CalendarIdValidate = (nameDoctor) => {
  if(nameDoctor === 'Dra. Juliana Leite'){
    return CalendarId.juliana;
  }else if (nameDoctor === 'Dra. Lucília Miranda') {
    return CalendarId.odontopediatria;
  }else {
    return CalendarId.dentistas;
  }
};

module.exports= CalendarIdValidate;
