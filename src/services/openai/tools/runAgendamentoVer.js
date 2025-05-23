import CalendarServices from "../../calendar/CalendarServices.js";

export async function runAgendamentoVer({ especialista, evento_id } = {}) {
  const calendar_id = CalendarUtils.idValidate(especialista);
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