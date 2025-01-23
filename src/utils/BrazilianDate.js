export default class BrazilianDate {
  static getLocalDate() {
    const date = new Date();
    const options = {
      timeZone: 'America/Recife',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    };
    const localDate = date.toLocaleString('pt-BR', options);

    return localDate;
  }

  static getLocalTime() {
    const date = new Date();
    const options = {
      timeZone: 'America/Recife',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    const localTime = date.toLocaleString('pt-BR', options);

    return localTime;
  }

  static getLocalDateTime() {
    return `${BrazilianDate.getLocalDate()} ${BrazilianDate.getLocalTime()}`;
  }

  static getLocalWeekDay() {
    const date = new Date();
    const options = {
      timeZone: 'America/Recife',
      weekday: 'long'
    };
    const weekDay = date.toLocaleDateString('pt-BR', options);
    const weekDayFormatted = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);

    return weekDayFormatted;
  }
}