import { CalendarUtils } from "../../../utils/calendar/CalendarUtils.js";
import CalendarServices from "../../calendar/CalendarServices.js";
import OpenAICrmServices from "../OpenAICrmServices.js";

/**
 * Tool/função para criar um agendamento no Google Calendar.
 * 
 * @param {Object} params
 * 
 */
export async function runAgendamentoCriar({ data_hora, especialista, titulo, motivo, lead_id }) {
  const calendar_id = CalendarUtils.idValidate(especialista);
  const calendar = new CalendarServices(calendar_id);
  const startDate = new Date(data_hora);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // Adiciona 30 minutos à data/hora
  const response = await calendar.createEvent({
    summary: titulo,
    start: startDate,
    end: endDate,
    description: motivo,
  });

  const openaiCrm = new OpenAICrmServices({ lead_id });
  await openaiCrm.setAppointmentDate({
    date: response.start.dateTime || data_hora,
    htmlLink: response.htmlLink,
    event_id: response.id,
    description: motivo,
  });

  return {
    sucesso: true,
    mensagem: "Agendamento criado com sucesso.",
    dados: response,
  };
}