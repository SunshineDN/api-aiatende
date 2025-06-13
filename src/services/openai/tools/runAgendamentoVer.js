import { CalendarUtils } from "../../../utils/calendar/CalendarUtils.js";
import CalendarServices from "../../calendar/CalendarServices.js";

export async function runAgendamentoVer({ evento_id } = {}) {
  const calendar_id = CalendarUtils.idValidate();
  const calendar = new CalendarServices(calendar_id);

  const evento = await calendar.getEvent(evento_id);

  if (!evento) {
    return {
      sucesso: false,
      mensagem: "Evento não encontrado.",
    };
  }

  return {
    sucesso: true,
    mensagem: "Evento encontrado com sucesso.",
    evento,
  };
}