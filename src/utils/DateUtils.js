import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import styled from './log/styled.js';

export default class DateUtils {
  static convertDateToMs(dateString) {
    dayjs.extend(customParseFormat);
    // Regex para identificar padrões comuns de datas
    const datePatterns = [
      { regex: /^(\d{4})-(\d{2})-(\d{2})$/, format: 'YYYY-MM-DD' },
      { regex: /^(\d{2})\/(\d{2})\/(\d{4})$/, format: 'DD/MM/YYYY' },
      { regex: /^(\d{2})-(\d{2})-(\d{4})$/, format: 'DD-MM-YYYY' },
      { regex: /^(\d{4})\/(\d{2})\/(\d{2})$/, format: 'YYYY/MM/DD' },
      { regex: /^(\d{2})\.(\d{2})\.(\d{4})$/, format: 'DD.MM.YYYY' },
      { regex: /^(\d{2}) (\w+) (\d{4})$/, format: 'DD MMMM YYYY' },
    ];

    // Tentativa de identificar o padrão correto
    for (const { regex, format } of datePatterns) {
      if (regex.test(dateString)) {
        const parsedDate = dayjs(dateString, format, true); // "true" valida o formato estritamente
        if (parsedDate.isValid()) {
          return parsedDate.valueOf(); // Retorna a data em milissegundos
        }
      }
    }

    // Caso nenhuma correspondência seja encontrada
    styled.warning('Data inválida ou formato desconhecido:', dateString);
    return null;
  }

  /**
   * Converte uma data no formato 'DD/MM/YYYY HH:mm' para segundos
   * @param {string} date - Data no formato 'DD/MM/YYYY HH:mm'
   * @returns {number} - Data convertida em segundos
   */
  static dateStringToSeconds(date) {
    dayjs.extend(customParseFormat);
    return Math.round(dayjs(date, 'DD/MM/YYYY HH:mm').valueOf() / 1000);
  }

  /**
   * Converte uma data no formato 'DD/MM/YYYY HH:mm' para o tipo Date
   * @param {string} date - Data no formato 'DD/MM/YYYY HH:mm'
   * @returns {Date} - Data convertida
   */
  static toDateTime(date) {
    dayjs.extend(customParseFormat);
    return dayjs(date, 'DD/MM/YYYY HH:mm').toDate();
  }

  static changeTimezone(date, ianatz) {
    const invdate = new Date(date.toLocaleString('en-US', { timeZone: ianatz }));

    const diff = date.getTime() - invdate.getTime();

    return new Date(date.getTime() - diff);
  }

  /**
   * Converte segundos em uma data no formato especificado
   * @param {number} seconds - Segundos desde 01/01/1970
   * @param {string} format - Formato da data (ex: 'DD/MM/YYYY HH:mm')
   * 
   * @returns {string} - Data formatada conforme o formato especificado
   */
  static secondsToFormatDateTime(seconds, format = 'DD/MM/YYYY HH:mm') {
    // Retornar a data no tipo Date
    return dayjs.unix(seconds).tz('America/Sao_Paulo').format(format);
  }

  /**
   * Converte segundos em uma data
   * @param {number} seconds - Segundos desde 01/01/1970
   * 
   * @returns {Date} - Data convertida
   */
  static secondsToDate(seconds) {
    return new Date(seconds * 1000);
  }

  /**
   * Converte uma data para segundos
   * @param {Date} date - Data a ser convertida
   * 
   * @returns {number} - Data convertida em segundos
   */
  static dateToSeconds(date = new Date()) {
    return Math.round(date.getTime() / 1000);
  }

  /**
   * Formata uma data
   * @param {object} options - Opções para formatar a data
   * @param {Date} options.date - Data a ser formatada
   * @param {string} [options.format='DD/MM/YYYY HH:mm'] - Formato da data
   * @param {boolean} [options.withWeekday=false] - Indica se o dia da semana deve ser incluído na formatação
   * 
   * @returns {string} - Data formatada conforme o formato especificado (com ou sem o dia da semana)
   */
  static formatDate({ date, format = 'DD/MM/YYYY HH:mm', withWeekday = false } = {}) {
    styled.info('Formatando data:', date);

    const formattedDate = dayjs(date).format(format);
    if (withWeekday) {
      const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      const weekday = days[date.getDay()];
      return `${weekday}, ${formattedDate}`;
    }
    return formattedDate;
  }
}
