import styled from "../utils/log/styled.js";
import WebCalendarServices from "../services/web-calendar/WebCalendarServices.js";

export default class WebCalendarController {
  static async initial(req, res) {
    try {
      const { query } = req.body;
      styled.info(query);
      const calendar = new WebCalendarServices(query);
      const response = await calendar.listInitialValues();
      styled.success('[WebCalendarController.initial] Listado horários iniciais com sucesso');
      res.status(200).json(response);
    } catch (error) {
      styled.error('[WebCalendarController.initial] Erro');
      console.error(error);
      res.status(500).json({ message: 'Erro ao processar a requisição' });
    }
  }

  static async choice(req, res) {
    try {
      const { turno, profissional, data } = req.body;
      const calendar = new WebCalendarServices();
      const response = await calendar.getChoiceDate(data, turno, profissional);
      styled.success('[WebCalendarController.choice] Listado horários disponíveis com data escolhida');
      res.status(200).json(response);
    } catch (error) {
      styled.error('[WebCalendarController.choice] Erro');
      console.error(error);
      res.status(500).json({ message: 'Erro ao processar a requisição' });
    }
  }

  static async register(req, res) {
    try {
      const { profissional, data, horario, query } = req.body;
      const calendar = new WebCalendarServices(query);
      const response = await calendar.insertEvent(profissional, data, horario);
      styled.success(`[WebCalendarController.register] Data agendada com sucesso no calendário de: ${profissional} no dia: ${data} às ${horario}`);
      res.status(201).json(response);
    } catch (error) {
      styled.error('[WebCalendarController.register] Erro');
      console.error(error);
      res.status(500).json({ message: 'Erro ao processar a requisição' });
    }
  }
}