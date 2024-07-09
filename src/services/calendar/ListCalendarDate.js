const CalendarIdValidate = require('../../utils/CalendarIdValidate');
const CalendarUtils = require('../../utils/CalendarUtils');
const GetUser = require('../kommo/GetUser');
const GetCustomFields = require('../kommo/GetCustomFields')
const AvailableDate =require('../../utils/AvailableDates')

const ListCalendarDate = async (payload, access_token = null) => {
  let user, nameDoctor,filledDates,eventData;
  try{
    const CalendarUtilsClass = new CalendarUtils(payload?.account?.id);

    user = await GetUser(payload,false,access_token);

    nameDoctor = user?.custom_fields_values?.filter(
      (field) => field.field_name === 'Dentista'
    )[0];

    custom_fields = await GetCustomFields(payload, access_token);

    filledDates = custom_fields?.filter(
      (field) => field.name === 'Datas ocupadas'
    )[0];
     
    
    try {
      eventData = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado', payload?.account?.id));
    } catch  {
      eventData = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não Encontrado', payload?.account?.id));
    }
    eventData.map((event) => {
      const data =event.Data
      console.log(data);
    })
    console.log('FIM !!!');

  }catch (err){
    console.error(err);
  }
};

module.exports = ListCalendarDate;
