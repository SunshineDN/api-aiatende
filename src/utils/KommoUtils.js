import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

export default class KommoUtils {
  constructor({ leads_custom_fields = [], contacts_custom_fields = [], pipelines = [] } = {}) {
    this.leads_custom_fields = leads_custom_fields;
    this.contacts_custom_fields = contacts_custom_fields;
    this.pipelines = pipelines;
  }

  findStatusByName(name) {
    const statuses = this.pipelines.map(pipeline => pipeline._embedded.statuses).flat();
    return statuses.filter(status => status.name === name)[0] || null;
  }

  findLeadsFieldByName(name) {
    return this.leads_custom_fields.filter(field => field.name === name)[0] || null;
  }

  findContactsFieldByName(name) {
    return this.contacts_custom_fields.filter(field => field.name === name)[0] || null;
  }

  findContactsFieldByCode(code) {
    return this.contacts_custom_fields.filter(field => field.code === code)[0] || null;
  }

  convertDateToMs(dateString = '' ) {
    dayjs.extend(customParseFormat);

    if (!dateString) {
      // Pegar a data atual do fuso horário do Brasil
      return Math.round(dayjs().valueOf() / 1000);
    }

    const datePatterns = [
      { regex: /^(\d{4})-(\d{2})-(\d{2})$/, format: 'YYYY-MM-DD' },
      { regex: /^(\d{2})\/(\d{2})\/(\d{4})$/, format: 'DD/MM/YYYY' },
      { regex: /^(\d{2})-(\d{2})-(\d{4})$/, format: 'DD-MM-YYYY' },
      { regex: /^(\d{4})\/(\d{2})\/(\d{2})$/, format: 'YYYY/MM/DD' },
      { regex: /^(\d{2})\.(\d{2})\.(\d{4})$/, format: 'DD.MM.YYYY' },
      { regex: /^(\d{2}) (\w+) (\d{4})$/, format: 'DD MMMM YYYY' },
    ];

    for (const { regex, format } of datePatterns) {
      if (regex.test(dateString)) {
        const parsedDate = dayjs(dateString, format, true);
        if (parsedDate.isValid()) {
          return Math.round(parsedDate.valueOf() / 1000);
        }
      }
    }

    return 'Invalid Date';
  }
}