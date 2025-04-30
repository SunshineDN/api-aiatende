import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

export default class KommoUtils {
  constructor({ leads_custom_fields = [], contacts_custom_fields = [], pipelines = [] } = {}) {
    this.leads_custom_fields = leads_custom_fields;
    this.contacts_custom_fields = contacts_custom_fields;
    this.pipelines = pipelines;
  }

  findPipelineByName(name) {
    name = name.toLowerCase().trim();
    return this.pipelines.filter(pipeline => pipeline.name.toLowerCase() === name)[0] || null;
  }

  findStatusByCode(pipelineName, code) {
    const pipeline = this.findPipelineByName(pipelineName);
    if (!pipeline) {
      return null;
    }

    const statuses = pipeline._embedded.statuses;
    return statuses.filter(status => status.id === code)[0] || null;
  }

  findStatusByName(name) {
    name = name.toLowerCase().trim();
    const statuses = this.pipelines.map(pipeline => pipeline._embedded.statuses).flat();
    return statuses.filter(status => status.name.toLowerCase() === name)[0] || null;
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

  convertDateToMs(dateString = '') {
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

    return null;
  }

  formatPhone(phone) {
    let string = '';

    // Verificar se o número é um número
    if (typeof phone === 'number') {
      string = phone.toString();
    } else {
      string = phone;
    }

    let newNumber = '';
    let ddd = '';

    // Remover caracteres especiais e espaços
    string = string.replace(/[^0-9]/g, '');

    //Caso o numero inicie com o 55, remover o 55
    // if (string.slice(0,2) === "55") {
    //   string = string.substring(2);
    // } else if (string.slice(0,3) === "+55") {
    //   string = string.substring(3);
    // } else if (string.slice(0,2) === "9.") { // Caso o número inicie com 9. remover o 9.
    //   string = string.substring(2);
    // } else if (string.slice(2,3) === " ") { // Caso tenha 2 digitos e apos um espaço, remover o espaço
    //   string = string.substring(3);
    // }
    if (string.slice(0, 2) === '55') {
      string = string.substring(2);
    }

    // Verificar se o número tem 11, 9 ou 8 dígitos
    if (string.length === 11) {
      ddd = string.slice(0, 2);
      newNumber = string.substring(3);
      // console.log("Número com 11 dígitos \n")

    } else if (string.length === 10) {
      ddd = string.slice(0, 2);
      newNumber = string.substring(2);
      // console.log("Número com 10 dígitos \n")

    } else if (string.length === 9) {
      ddd = '81';
      newNumber = string.substring(1);
      // console.log("Número com 9 dígitos \n")

    } else if (string.length === 8) {
      ddd = '81';
      newNumber = string;
      // console.log("Número com 8 dígitos \n")
    }

    // Retornar o número formatado
    return `+55${ddd}${newNumber.substring(0, 4)}${newNumber.substring(4)}`;
  }

  dateStringToSeconds(date) {
    dayjs.extend(customParseFormat);
    return Math.round(dayjs(date, 'DD/MM/YYYY HH:mm').valueOf() / 1000) + 10800;
  }
}