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
  constructor(query) {
    this.#kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.#promise = StaticUtils.isBase64(query) ? this.#kommo.getLead({ id: StaticUtils.decodeString(query) }) : this.#kommo.listLeads({ query, first_created: true });
  }

  async listInitialValues() {
    const lead = await this.#promise;

    const dentista = LeadUtils.findLeadField({ lead, fieldName: 'Dentista', value: true });
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

    // const calendar = new CalendarUtils();
    // const calendarId = CalendarUtils.idValidate(dentista);
    // const events = await calendar.listAvailableOptions(calendarId);

    const calendar = new CalendarServices(CalendarUtils.idValidate(dentistaNome));
    const events = await calendar.getAvailableOptions();
    return events;

    const actualDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

    console.log(calendarId);
    console.log(events);
    const text = `
Considere que você está agendando uma consulta para:
- **Dentista:** ${dentistaNome}
- **Período:** ${periodo}
- **Turno:** ${turno}

📅 **Data atual:** ${actualDate}

⚠️ **Regras a seguir:**
- Os turnos são: 
  - Manhã: 8h - 12h 
  - Tarde: 13h - 17h 
  - Noite: 18h - 20h.
- Para *Próxima semana*, escolha uma data entre 7 e 14 dias a partir de hoje.
- Se o turno não for 'Qualquer horário', selecione até 2 horários disponíveis para o turno escolhido.
- Caso contrário, selecione de 1 a 6 horários disponíveis por turno.
- Os horários devem estar no calendário enviado.
- **Jamais escolha horários indisponíveis.**

📅 **Calendário de horários disponíveis:**
${events}

📝 **Formato da resposta (JSON):**
\`\`\`json
{
  "date": "12/12/2024",
  "avaiableOptions": ["08:00", "11:00"]
}
\`\`\`
`;

    const { message } = await OpenAIController.promptMessage(text);
    const obj = StaticUtils.extractJsonPrompt(message);
    return { ...obj, dentista: dentistaNome, periodo, turno };
  }

  async listDefaultDate(turno, dentista, periodo) {
    const calendar = new CalendarUtils();
    const calendarId = CalendarUtils.idValidate(dentista);
    const events = await calendar.listAvailableOptions(calendarId);
    const actualDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

    const text = `Considere que você está agendando uma consulta para:
Dentista: ${dentista}
Período: ${periodo}
Turno: ${turno}.

O dia atual é ${actualDate}.

Aqui vão as regras que devem ser obedecidas:
- Os turnos de funcionamento são manhã das 8h às 12h, tarde das 13h às 17h e noite das 18h às 20h.
- Baseado no período, você deve escolher uma data aleatória dentro do período.
- Se o período for 'Próxima semana', você deve escolher uma data aleatória após 7 dias da data atual e antes de 14 dias da data atual.
- Você deve pegar apenas uma data.
- Caso o turno seja diferente de 'Qualquer horário', você deve pegar apenas dois horários disponíveis para o turno escolhido. Se não, você deve pegar os horários disponíveis em cada turno para a data escolhida, sendo um horário o mínimo e seis no máximo.
- Os horários disponíveis estão no calendário que será enviado.
- Escolha apenas horários e datas que estão no calendário.
- Em hipótese alguma, deve-se escolher datas ou horários que não estejam disponíveis no calendário.

Com base nisso, escolha uma data e horários disponíveis para a consulta seguindo as regras acima no calendário abaixo:

${events}

O formato da resposta deve ser um objeto com a data e os horários escolhidos seguindo o padrão a seguir:

{
  date: '12/12/2024',
  avaiableOptions: ['08:00', '11:00']
}
  
A RESPOSTA DEVE SER ENVIADA NO FORMATO JSON. (\`\`\`json)`;


    const { message } = await OpenAIController.promptMessage(text);

    // Exemplo de retorno após a extração do JSON:
    // {
    //   "date": "08/01/2025",
    //   "avaiableOptions": ["11:00", "11:30"]
    // }
    return StaticUtils.extractJsonPrompt(message);
  }

  async listChoiceDate(turno, dentista, data) {
    const calendar = new CalendarUtils();
    const calendarId = CalendarUtils.idValidate(dentista);
    const events = await calendar.listAvailableOptions(calendarId);
    const actualDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

    const text = `Considere que você está agendando uma consulta para:
Dentista: ${dentista}
Data escolhida: ${data}
Turno: ${turno}.

O dia atual é ${actualDate}.

Aqui vão as regras que devem ser obedecidas:
- Os turnos de funcionamento são manhã das 8h às 12h, tarde das 13h às 17h e noite das 18h às 20h.
- Você deve pegar apenas a data escolhida.
- Caso o turno seja diferente de 'Qualquer horário', você deve pegar apenas os dois primeiros horários disponíveis para o turno escolhido. Se não, você deve pegar os primeiros horários disponíveis em cada turno para a data escolhida, sendo dois horários para cada turno, ou seja, seis opções no máximo. Nunca ultrapasse esse limite máximo.
- Os horários disponíveis estão no calendário que será enviado.
- Escolha apenas horários e datas que estão no calendário.
- Em hipótese alguma, deve-se escolher datas ou horários que não estejam disponíveis no calendário.

Com base nisso, escolha uma data e horários disponíveis para a consulta seguindo as regras acima no calendário abaixo:

${events}

O formato da resposta deve ser um objeto com a data e os horários escolhidos seguindo o padrão a seguir:

{
  date: '12/12/2024',
  avaiableOptions: ['08:00', '11:00']
}

*** OBS: CASO NÃO EXISTA HORÁRIOS DISPONÍVEIS PARA O TURNO ESCOLHIDO, VOCÊ DEVE RETORNAR UM OBJETO COM A DATA E O CAMPO DE HORÁRIOS VAZIO. ***
  
A RESPOSTA DEVE SER ENVIADA NO FORMATO JSON.`;


    const { message } = await OpenAIController.promptMessage(text);
    return StaticUtils.extractJsonPrompt(message);
  }

  async registerDate(dentista, data, horario, lead_id) {
    const kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });

    const lead_id_decoded = StaticUtils.decodeString(lead_id);
    const lead = await kommo.getLead({ id: lead_id_decoded, withParams: 'contacts' });

    const procedimento = LeadUtils.findLeadField({ lead, fieldName: 'Procedimento', value: true });
    const nome = lead?.contact?.name;

    const summary = `${nome} - ${procedimento}`;
    const calendar = new CalendarUtils();
    const dentistaNome = StaticUtils.getCalendarName(dentista);
    const calendarId = CalendarUtils.idValidate(dentistaNome);

    const startDateTime = StaticUtils.toDateTime(`${data} ${horario}`);
    startDateTime.setHours(startDateTime.getHours() + 3);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);

    const obj = {
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Recife',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Recife',
      },
      summary,
      description: 'Lead se agendou pelo formulário do site.',
    };

    const registerEvent = await calendar.executeRegisterEvent(calendarId, obj);

    const kommoUtils = new KommoUtils({ pipelines: await kommo.getPipelines(), leads_custom_fields: await kommo.getLeadsCustomFields() });

    const dataAgendamento = await kommoUtils.findLeadsFieldByName('Data do Agendamento');
    const eventIdField = await kommoUtils.findLeadsFieldByName('Event ID');
    const eventLinkField = await kommoUtils.findLeadsFieldByName('Event Link');
    const eventSummaryField = await kommoUtils.findLeadsFieldByName('Event Summary');
    const eventStartField = await kommoUtils.findLeadsFieldByName('Event Start');

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
      }
    ]

    await kommo.updateLead({
      id: lead_id_decoded,
      status_id: closedWon.id,
      pipeline_id: closedWon.pipeline_id,
      custom_fields_values: custom_fields
    });

    return registerEvent;
  }
}