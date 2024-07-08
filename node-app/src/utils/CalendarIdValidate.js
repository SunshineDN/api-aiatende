const CalendarId = require('../config/calendarId');

const CalendarIdValidate = (condition = null, account_id) => {
  console.log('Account ID (CalendarIdValidate): ', account_id);
  if (account_id === 32000011) {
    if(condition === 'Dra. Juliana Leite'){
      return CalendarId.dental_sante.juliana;
    }else if (condition === 'Dra. Lucília Miranda') {
      return CalendarId.dental_sante.odontopediatria;
    }else {
      return CalendarId.dental_sante.dentistas;
    }
  } else if (account_id === 31205035) {
    if(condition === 'Dra. Juliana Leite'){
      return CalendarId.ai_atende.juliana;
    }else if (condition === 'Dra. Lucília Miranda') {
      return CalendarId.ai_atende.odontopediatria;
    }else {
      return CalendarId.ai_atende.dentistas;
    }
  }
};

module.exports= CalendarIdValidate;
