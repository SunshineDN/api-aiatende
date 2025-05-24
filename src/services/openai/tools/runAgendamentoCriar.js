import { CalendarUtils } from "../../../utils/calendar/CalendarUtils.js";
import CalendarServices from "../../calendar/CalendarServices.js";

/**
 * Tool/função para criar um agendamento no Google Calendar.
 * 
 * @param {Object} params
 * 
 */
export async function runAgendamentoCriar({ data_hora, especialista, titulo, descricao }) {
  const calendar_id = CalendarUtils.idValidate(especialista);
  const calendar = new CalendarServices(calendar_id);
  const startDate = new Date(data_hora);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // Adiciona 30 minutos à data/hora
  const response = await calendar.createEvent({
    summary: titulo,
    start: startDate,
    end: endDate,
    description: descricao,
  });
  return {
    sucesso: true,
    mensagem: "Agendamento criado com sucesso.",
    dados: response,
  };
}