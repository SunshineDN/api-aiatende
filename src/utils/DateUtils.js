import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import styled from './log/styledLog.js';
import 'dayjs/locale/pt-br.js';

dayjs.locale('pt-br');

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

  static dateTimeToSeconds(date) {
    dayjs.extend(customParseFormat);
    // Vamos converter a data para timezone do Brasil e retorna em segundos
    const dateParsed = dayjs(date, 'DD/MM/YYYY HH:mm').locale('pt-br');
    return dateParsed.unix();
    // return Math.round(dayjs(date, 'DD/MM/YYYY HH:mm').valueOf() / 1000);
  }
}