import { CalendarUtils } from "../../../utils/calendar/CalendarUtils.js";
import CalendarServices from "../../calendar/CalendarServices.js";

/**
 * Função para deletar um agendamento
 * @param {Object} params - Parâmetros da função
 * @param {string} params.agendamento_id - ID do agendamento a ser deletado
 * @param {string} params.especialista - ID do especialista
 * @return {Promise<Object>} Resultado da operação
 */
export async function runAgendamentoDeletar({ agendamento_id, especialista }) {
  const calendar_id = CalendarUtils.idValidate(especialista);
  const calendar = new CalendarServices(calendar_id);
  const response = await calendar.deleteEvent(agendamento_id);
  return {
    sucesso: true,
    mensagem: "Agendamento deletado com sucesso.",
    resultado: response,
  };
}