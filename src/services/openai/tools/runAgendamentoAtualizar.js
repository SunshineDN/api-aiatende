import { CalendarUtils } from "../../../utils/calendar/CalendarUtils.js";
import CalendarServices from "../../calendar/CalendarServices.js";
import OpenAICrmServices from "../OpenAICrmServices.js";

/**
 * Tool/função para atualizar um agendamento no Google Calendar.
 * 
 * @param {Object} params
 * @param {string} params.id_agendamento - ID do agendamento a ser atualizado.
 * @param {Date} params.nova_data - Nova data para o agendamento.
 * @param {string} params.titulo - Título do evento.
 * @param {string} params.descricao - Descrição do evento.
 * @returns {Promise<Object>} Resultado da atualização do agendamento.
 */
export async function runAgendamentoAtualizar({ id_agendamento, nova_data, titulo, descricao, lead_id }) {
  const calendar_id = CalendarUtils.idValidate();
  const calendar = new CalendarServices(calendar_id);
  const startDate = new Date(nova_data);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // Adiciona 30 minutos à nova data

  const response = await calendar.updateEvent({
    eventId: id_agendamento,
    summary: titulo,
    start: startDate,
    end: endDate,
    description: descricao,
  });

  const openaiCrm = new OpenAICrmServices({ lead_id });
  await openaiCrm.updateAppointmentDate({
    date: response.start.dateTime || nova_data,
    description: descricao,
  });

  return {
    sucesso: true,
    mensagem: "Agendamento atualizado / reagendado com sucesso.",
    dados: response,
  };
}