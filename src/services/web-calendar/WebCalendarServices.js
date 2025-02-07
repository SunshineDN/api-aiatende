import { CalendarUtils } from "../../utils/calendar/CalendarUtils.js";
import StaticUtils from "../../utils/StaticUtils.js";
import OpenAIController from "../../controllers/OpenAIController.js";
import KommoServices from "../kommo/KommoServices.js";
import LeadUtils from "../../utils/LeadUtils.js";
import styled from "../../utils/log/styled.js";
import KommoUtils from "../../utils/KommoUtils.js";
import CalendarServices from "../calendar/CalendarServices.js";
import KommoCalendarServices from "../kommo/KommoCalendarServices.js";

export default class WebCalendarServices {
  #kommo;
  #promise;
  constructor(query = '') {
    this.#kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    if (query) {
      this.#promise = StaticUtils.isBase64(query) ? this.#kommo.getLead({ id: StaticUtils.decodeString(query) }) : this.#kommo.listLeads({ query: StaticUtils.formatTelephone(StaticUtils.asciiToPhone(query)), first_created: true });
    }
  }

  async listInitialValues() {
    const lead = await this.#promise;

    const profissional = LeadUtils.findLeadField({ lead, fieldName: 'Profissional', value: true });
    const periodo = LeadUtils.findLeadField({ lead, fieldName: 'Período', value: true });
    const turno = LeadUtils.findLeadField({ lead, fieldName: 'Turno', value: true });

    if (!profissional || !periodo || !turno) {
      styled.warning('[WebCalendarServices.listInitialValues] O lead não possui os campos necessários para a execução do serviço.');
      return {
        profissional: '',
        periodo: '',
        turno: '',
        date: null,
        availableOptions: []
      };
    }

    const dentistaNome = StaticUtils.getCalendarName(profissional);

    const calendar = new CalendarServices(CalendarUtils.idValidate(dentistaNome));
    const initialEvents = await calendar.getAvailableOptions();

    const actualDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

    const datePrompt = `
Considere que você está capturando uma data para agendamento de consulta para:
- **Dentista:** ${profissional}
- **Turno:** ${turno}
- **Período:** ${periodo}

📅 **Data atual (hoje):** ${actualDate}

Sua tarefa é capturar uma data disponível no calendário para agendamento de consulta.
**Esta data deve ser capturada de acordo com o período escolhido pelo lead.**

📅 **Calendário de horários disponíveis:**
[${initialEvents}]

Levando em consideração o período escolhido pelo lead, você deve capturar uma única data disponível no calendário para agendamento de consulta.

O retorno da resposta deve ser apenas a data escolhida, no formato "DD/MM/AAAA".
`;

    styled.info('Prompt para capturar a data:', datePrompt);

    const { message: date } = await OpenAIController.promptMessage(datePrompt);

    const events = await calendar.getChoiceDate(date);

    const text = this.#choiceDatePrompt(date, turno, profissional, events);

    styled.info('Prompt para listar os valores iniciais:', text);
    const { message } = await OpenAIController.promptMessage(text);
    const obj = StaticUtils.extractJsonPrompt(message);
    return { ...obj, profissional: dentistaNome, turno };
  }

  async getChoiceDate(data, turno, profissional) {
    const calendar = new CalendarServices(CalendarUtils.idValidate(profissional));
    const events = await calendar.getChoiceDate(data);

    const text = this.#choiceDatePrompt(data, turno, profissional, events);

    styled.info('Prompt para data escolhida:', text);
    const { message } = await OpenAIController.promptMessage(text);
    const obj = StaticUtils.extractJsonPrompt(message);
    return { ...obj, profissional, turno };
  }

  #choiceDatePrompt(data, turno, profissional, events) {
    const actualDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

    return `
Considere que você está agendando uma consulta para:
- **Dentista:** ${profissional}
- **Turno:** ${turno}
- **Data escolhida:** ${data}

📅 **Data atual:** ${actualDate}

⚠️ **Regras a seguir:**
- Você deve capturar exclusivamente horários disponíveis exatamente na data escolhida.
- Jamais retorne horários de outras datas.
- Se não houver horários disponíveis na data escolhida, retorne "availableOptions": [].
- Os turnos são:
  - Manhã: 8h - 12h
  - Tarde: 13h - 17h
  - Noite: 18h - 20h

📌 **Critérios de seleção:**
- Se um turno específico for escolhido (Manhã, Tarde ou Noite), selecione até 2 horários disponíveis dentro desse turno, somente na data escolhida.
  - Totalizar no máximo 2 horários no retorno.
- Se o turno for 'Qualquer horário':
  - Filtrar apenas os horários da data escolhida (${data}).
  - Selecionar até 2 horários por turno:
    - Manhã (8h - 12h): Pegar os 2 primeiros horários disponíveis se houver.
    - Tarde (13h - 17h): Pegar os 2 primeiros horários disponíveis se houver.
    - Noite (18h - 20h): Pegar os 2 primeiros horários disponíveis se houver.
    - Totalizar no máximo 6 horários no retorno.
    - Caso não haja horários disponíveis em algum turno, esse turno fica vazio no retorno.

📅 **Calendário de horários disponíveis:**
[${events}]

📌 **Atenção:** Se a data escolhida **não existir no calendário de horários disponíveis**, **retorne um array vazio** para "availableOptions".

📝 **EXEMPLO do Formato da resposta (JSON):**
\`\`\`json
{
  "date": "12/12/2024",
  "availableOptions": ["08:00", "11:00"]
}
\`\`\`
`;
  }

  async insertEvent(profissional, data, horario) {
    const lead = await this.#promise;

    const calendar = new KommoCalendarServices(lead.id);

    const registerEvent = await calendar.scheduleLead({ description: 'Lead se agendou pelo formulário do site.', dateString: `${data} ${horario}`, profissional });

    return registerEvent;
  }
}