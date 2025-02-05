import { CalendarUtils } from "../../utils/calendar/CalendarUtils.js";
import StaticUtils from "../../utils/StaticUtils.js";
import OpenAIController from "../../controllers/OpenAIController.js";
import KommoServices from "../kommo/KommoServices.js";
import LeadUtils from "../../utils/LeadUtils.js";
import styled from "../../utils/log/styled.js";
import KommoUtils from "../../utils/KommoUtils.js";
import CalendarServices from "../calendar/CalendarServices.js";

export default class WebCalendarServices {
  #kommo;
  #promise;
  constructor(query = '') {
    this.#kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    if (query) {
      this.#promise = StaticUtils.isBase64(query) ? this.#kommo.getLead({ id: StaticUtils.decodeString(query), withParams: 'contacts' }) : this.#kommo.listLeads({ query, first_created: true, withParams: 'contacts' });
    }
  }

  async listInitialValues() {
    const lead = await this.#promise;

    const dentista = LeadUtils.findLeadField({ lead, fieldName: 'Profissional', value: true });
    const periodo = LeadUtils.findLeadField({ lead, fieldName: 'Período', value: true });
    const turno = LeadUtils.findLeadField({ lead, fieldName: 'Turno', value: true });

    if (!dentista || !periodo || !turno) {
      styled.warning('[WebCalendarServices.listInitialValues] O lead não possui os campos necessários para a execução do serviço.');
      return {
        dentista: '',
        periodo: '',
        turno: '',
        date: null,
        avaiableOptions: []
      };
    }

    const dentistaNome = StaticUtils.getCalendarName(dentista);

    const calendar = new CalendarServices(CalendarUtils.idValidate(dentistaNome));
    const events = await calendar.getAvailableOptions();

    const actualDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

    const text = `
Considere que você está agendando uma consulta para:
- **Dentista:** ${dentista}
- **Turno:** ${turno}
- **Período:** ${periodo}

📅 **Data atual (hoje):** ${actualDate}

⚠️ **Regras a seguir:**
- Se o período for 'Próxima semana', você deve escolher uma data aleatória **disponível no calendário** após 7 dias da data atual e antes de 14 dias da data atual.
- Se o período incluir 'Nesta semana', você deve escolher uma data **disponível no calendário** a paritr de hoje e antes de 7 dias da data atual.
- Você deve capturar apenas uma data disponível **exclusivamente** dentro do período escolhido.
- Você deve capturar **exclusivamente** horários disponíveis.
- **Jamais retorne horários de outras datas.**  
- Se **não houver horários disponíveis**, retorne "availableOptions": [].  
- Os turnos são:
  - **Manhã:** 8h - 12h
  - **Tarde:** 13h - 17h
  - **Noite:** 18h - 20h.
- Se o turno **não for** 'Qualquer horário', **selecione até no máximo 2 horários** disponíveis dentro do turno escolhido.
- Se o turno **for** 'Qualquer horário', **selecione até 2 opções do turno da manhã, 2 da tarde e 2 da noite, no máximo**.

📅 **Calendário de horários disponíveis:**
${events}

📌 **Atenção:** **não existir no calendário de horários disponíveis**, **retorne um array vazio** para "availableOptions".

📝 **EXEMPLO do Formato da resposta (JSON):**
\`\`\`json
{
  "date": "12/12/2024",
  "avaiableOptions": ["08:00", "11:00"]
}
\`\`\`
`;
    console.log(text);
    const { message } = await OpenAIController.promptMessage(text);
    const obj = StaticUtils.extractJsonPrompt(message);
    return { ...obj, dentista: dentistaNome, turno };
  }

  async getChoiceDate(data, turno, dentista) {
    const actualDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

    const calendar = new CalendarServices(CalendarUtils.idValidate(dentista));
    const events = await calendar.getAvailableOptions();

    const text = `
Considere que você está agendando uma consulta para:
- **Dentista:** ${dentista}
- **Turno:** ${turno}
- **Data escolhida:** ${data}

📅 **Data atual:** ${actualDate}

⚠️ **Regras a seguir:**
- Você deve capturar **exclusivamente** horários disponíveis **exatamente na data escolhida**.  
- **Jamais retorne horários de outras datas.**  
- Se **não houver horários disponíveis na data escolhida**, retorne "availableOptions": [].  
- Os turnos são:
  - **Manhã:** 8h - 12h
  - **Tarde:** 13h - 17h
  - **Noite:** 18h - 20h.
- Se o turno **não for** 'Qualquer horário', selecione **até 2 horários** disponíveis dentro do turno escolhido, **somente na data escolhida**.
- Se o turno **for** 'Qualquer horário', selecione até **2 opções do turno da manhã, 2 da tarde e 2 da noite**, **somente na data escolhida**.

📅 **Calendário de horários disponíveis:**
${events}

📌 **Atenção:** Se a data escolhida **não existir no calendário de horários disponíveis**, **retorne um array vazio** para "availableOptions".

📝 **EXEMPLO do Formato da resposta (JSON):**
\`\`\`json
{
  "date": "12/12/2024",
  "avaiableOptions": ["08:00", "11:00"]
}
\`\`\`
`;

    console.log(text);
    const { message } = await OpenAIController.promptMessage(text);
    const obj = StaticUtils.extractJsonPrompt(message);
    return { ...obj, dentista, turno };
  }

  async insertEvent(dentista, data, horario) {
    const lead = await this.#promise;

    const procedimento = LeadUtils.findLeadField({ lead, fieldName: 'Procedimento', value: true });
    const agendamento = LeadUtils.findLeadField({ lead, fieldName: 'Data do Agendamento', value: true });

    const nome = lead?.contact?.name;

    const summary = `${nome} - ${procedimento}`;
    const dentistaNome = StaticUtils.getCalendarName(dentista);

    const calendarId = CalendarUtils.idValidate(dentistaNome);
    const calendar = new CalendarServices(calendarId);

    const startDateTime = StaticUtils.toDateTime(`${data} ${horario}`);
    startDateTime.setHours(startDateTime.getHours() + 3);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);

    const registerEvent = await calendar.createEvent({ summary, description: 'Lead se agendou pelo formulário do site.', start: startDateTime, end: endDateTime });

    const kommoUtils = new KommoUtils({ pipelines: await this.#kommo.getPipelines(), leads_custom_fields: await this.#kommo.getLeadsCustomFields() });

    const dataAgendamento = await kommoUtils.findLeadsFieldByName('Data do Agendamento');
    const eventIdField = await kommoUtils.findLeadsFieldByName('Event ID');
    const eventLinkField = await kommoUtils.findLeadsFieldByName('Event Link');
    const eventSummaryField = await kommoUtils.findLeadsFieldByName('Event Summary');
    const eventStartField = await kommoUtils.findLeadsFieldByName('Event Start');
    const whenScheduled = await kommoUtils.findLeadsFieldByName('Quando foi agendado');
    const lastScheduled = await kommoUtils.findLeadsFieldByName('Último agendamento');

    const closedWon = await kommoUtils.findStatusByCode('03 - PRÉ-AGENDAMENTO', 142);

    const custom_fields = [
      {
        field_id: dataAgendamento.id,
        values: [
          {
            value: kommoUtils.dateTimeToSeconds(`${data} ${horario}`),
          }
        ]
      },
      {
        field_id: eventIdField.id,
        values: [
          {
            value: registerEvent.id,
          }
        ]
      },
      {
        field_id: eventLinkField.id,
        values: [
          {
            value: registerEvent.htmlLink,
          }
        ]
      },
      {
        field_id: eventSummaryField.id,
        values: [
          {
            value: registerEvent.summary,
          }
        ]
      },
      {
        field_id: eventStartField.id,
        values: [
          {
            value: `${data} ${horario}`,
          }
        ]
      },
      {
        field_id: whenScheduled.id,
        values: [
          {
            value: kommoUtils.dateTimeToSeconds(new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' })),
          }
        ]
      },
      {
        field_id: lastScheduled.id,
        values: [
          {
            value: agendamento ? kommoUtils.dateTimeToSeconds(`${data} ${horario}`) : kommoUtils.dateTimeToSeconds(new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' }))
          }
        ]
      }
    ]

    await this.#kommo.updateLead({
      id: lead.id,
      status_id: closedWon.id,
      pipeline_id: closedWon.pipeline_id,
      custom_fields_values: custom_fields
    });

    return registerEvent;
  }
}