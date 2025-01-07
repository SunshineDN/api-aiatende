import styled from "../utils/log/styledLog.js";
import WebCalendarServices from "../services/web-calendar/WebCalendarServices.js";

export default class WebCalendarController {
  static async initial(req, res) {
    try {
      const { lead_id } = req.body;
      const response = await WebCalendarServices.listInitialValues(lead_id);
      styled.success('[WebCalendarController.initial] Listado horários iniciais com sucesso');
      res.status(200).json(response);
    } catch (error) {
      styled.error('[WebCalendarController.initial] Erro');
      console.error(error);
      res.status(500).json({ message: 'Erro ao processar a requisição' });
    }
  }

  static async default(req, res) {
    try {
      const { turno, dentista, periodo } = req.body;
      const response = await WebCalendarServices.listDefaultDate(turno, dentista, periodo);
      styled.success('[WebCalendarController.default] Listado horários disponíveis com sucesso');
      res.status(200).json(response);
    } catch (error) {
      styled.error('[WebCalendarController.default] Erro');
      console.error(error);
      res.status(500).json({ message: 'Erro ao processar a requisição' });
    }
  }

  static async choice(req, res) {
    try {
      const { turno, dentista, data } = req.body;
      const response = await WebCalendarServices.listChoiceDate(turno, dentista, data);
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
      const { dentista, data, horario, lead_id } = req.body;
      const response = await WebCalendarServices.registerDate(dentista, data, horario, lead_id);
      styled.success(`[WebCalendarController.register] Data agendada com sucesso no calendário de: ${dentista} no dia: ${data} às ${horario}`);
      res.status(201).json(response);
    } catch (error) {
      styled.error('[WebCalendarController.register] Erro');
      console.error(error);
      res.status(500).json({ message: 'Erro ao processar a requisição' });
    }
  }
}