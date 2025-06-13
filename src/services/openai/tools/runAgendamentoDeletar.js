import { CalendarUtils } from "../../../utils/calendar/CalendarUtils.js";
import CalendarServices from "../../calendar/CalendarServices.js";
import OpenAICrmServices from "../OpenAICrmServices.js";

/**
 * Função para deletar um agendamento
 * @param {Object} params - Parâmetros da função
 * @param {string} params.agendamento_id - ID do agendamento a ser deletado
 * @return {Promise<Object>} Resultado da operação
 */
export async function runAgendamentoDeletar({ agendamento_id, lead_id }) {
  const calendar_id = CalendarUtils.idValidate();
  const calendar = new CalendarServices(calendar_id);
  const response = await calendar.deleteEvent(agendamento_id);

  const openaiCrm = new OpenAICrmServices({ lead_id });
  await openaiCrm.emptyAppointmentDate();

  return {
    sucesso: true,
    mensagem: "Agendamento deletado com sucesso.",
    resultado: response,
  };
}