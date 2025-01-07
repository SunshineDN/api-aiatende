import { CalendarUtils } from "../../utils/calendar/CalendarUtils.js";
import StaticUtils from "../../utils/StaticUtils.js";
import OpenAIController from "../../controllers/OpenAIController.js";
import KommoServices from "../kommo/KommoServices.js";
import LeadUtils from "../../utils/LeadUtils.js";
import styled from "../../utils/log/styledLog.js";

export default class WebCalendarServices {

  static async listInitialValues(lead_id) {
    const kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    const lead_id_decoded = StaticUtils.decodeString(lead_id);
    const lead = await kommo.getLead({ id: lead_id_decoded });

    const dentista = LeadUtils.findLeadField({ lead, fieldName: 'Dentista', value: true });
    const dentistaNome = StaticUtils.getDentistName(dentista);
    const periodo = LeadUtils.findLeadField({ lead, fieldName: 'Período', value: true });
    const turno = LeadUtils.findLeadField({ lead, fieldName: 'Turno', value: true });

    const calendar = new CalendarUtils();
    const calendarId = CalendarUtils.idValidate(dentista);
    const events = await calendar.listAvailableOptions(calendarId);
    const actualDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

    const text = `Considere que você está agendando uma consulta para:
Dentista: ${dentistaNome}
Período: ${periodo}
Turno: ${turno}.

O dia atual é ${actualDate}.

Aqui vai algumas regras:
- Os turnos de funcionamento são manhã das 8h às 12h, tarde das 13h às 17h e noite das 18h às 20h.
- Baseado no período, você deve escolher uma data aleatória dentro do período.
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
    const obj = StaticUtils.extractJsonPrompt(message);
    return { ...obj, dentista: dentistaNome, periodo, turno };
  }

  static async listDefaultDate(turno, dentista, periodo) {
    const calendar = new CalendarUtils();
    const calendarId = CalendarUtils.idValidate(dentista);
    const events = await calendar.listAvailableOptions(calendarId);
    const actualDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

    const text = `Considere que você está agendando uma consulta para:
Dentista: ${dentista}
Período: ${periodo}
Turno: ${turno}.

O dia atual é ${actualDate}.

Aqui vai algumas regras:
- Os turnos de funcionamento são manhã das 8h às 12h, tarde das 13h às 17h e noite das 18h às 20h.
- Baseado no período, você deve escolher uma data aleatória dentro do período.
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

  static async listChoiceDate(turno, dentista, data) {
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

  static async registerDate(dentista, data, horario, lead_id) {
    const kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    const lead_id_decoded = StaticUtils.decodeString(lead_id);
    const lead = await kommo.getLead({ id: lead_id_decoded, withParams: 'contacts' });
    const procedimento = LeadUtils.findLeadField({ lead, fieldName: 'Procedimento', value: true });
    const nome = lead?.contact?.name;
    // const email = LeadUtils.findContactField({ contact: lead.contact, fieldName: 'Email', value: true });

    const summary = `${nome} - ${procedimento}`;
    const calendar = new CalendarUtils();
    const dentistaNome = StaticUtils.getDentistName(dentista);
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

    // if (email) {
    //   const client_name = process.env.CLIENT_NAME;
    //   const client_email = process.env.CLIENT_EMAIL;
    //   const client_address = process.env.CLIENT_ADDRESS;
    //   styled.info('[WebCalendarServices.registerDate] Enviando email com a identificação do cliente');
    //   if (client_name && client_email && client_address) {
    //     obj.attendees = [
    //       {
    //         displayName: nome,
    //         email,
    //       }
    //     ];
    //     obj.creator = {
    //       displayName: client_name,
    //       email: client_email
    //     };
    //     obj.location = client_address;
    //   }
    // }

    return await calendar.executeRegisterEvent(calendarId, obj);
  }
}