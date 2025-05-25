import { CalendarUtils } from "../../../utils/calendar/CalendarUtils.js";
import CalendarServices from "../../calendar/CalendarServices.js";


/**
 * Função para listar datas disponíveis para agendamento
 * @param {Object} params - Parâmetros da função
 * @param {string} params.preferred_date - Data preferida para agendamento
 * @param {string} params.time - Horário preferido para agendamento
 * @param {string} params.specialist - ID do especialista
 * @return {Promise<Object>} Resultado da operação
 */
export async function runAgendamentoListarDatas({ preferred_date, time, specialist } = {}) {

  if (preferred_date) {
    const regex = /(\d{4})-(\d{2})-(\d{2})/;
    if (regex.test(preferred_date)) {
      preferred_date = preferred_date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");
    }
  }

  const calendar_id = CalendarUtils.idValidate(specialist);
  const calendar = new CalendarServices(calendar_id);
  let avaiableDates;

  if (preferred_date && time) {
    avaiableDates = await calendar.getChoiceDateTime(preferred_date, time);
  } else if (preferred_date) {
    avaiableDates = await calendar.getChoiceDate(preferred_date);
  } else {
    avaiableDates = await calendar.getAvailableOptions();
  }

  if (avaiableDates.length === 0) {
    return {
      sucesso: false,
      mensagem: "Nenhuma data disponível para agendamento.",
    };
  }

  return {
    sucesso: true,
    mensagem: "Datas disponíveis para agendamento:",
    datas: avaiableDates,
  };
};