const CalendarIdValidate = require('../../utils/CalendarIdValidate');
const CalendarUtils = require('../../utils/CalendarUtils');
// const GetUser = require('../kommo/GetUser');
// const CalendarIdValidate = require('../../utils/CalendarIdValidate');

const ListCalendarDate = async () => {
//   let user;
  try{
    const CalendarUtilsClass = new CalendarUtils(31205035);

    // user = await GetUser(payload,false,access_token);

    try {
    
      await CalendarUtilsClass.list(CalendarIdValidate(null,31205035));
    } catch  {
      await CalendarUtilsClass.list(CalendarIdValidate(null,31205035));

    }
    console.log('FIM !!!');

  }catch (err){
    console.error(err);
  }
};

module.exports = ListCalendarDate;
