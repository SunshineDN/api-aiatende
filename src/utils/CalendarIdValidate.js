const CalendarId = require('../config/calendarId');

const CalendarIdValidate = (condition = null) => {
  if (condition === 'Dr. Nelson Coutinho') {
    return CalendarId.nelsoncoutinho;
  } else {
    return CalendarId.outros;
  }
};

module.exports = CalendarIdValidate;
