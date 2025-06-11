// Novos imports
import KommoCalendarServices from '../services/kommo/KommoCalendarServices.js';
import styled from '../utils/log/styled.js';

export default class KommoCalendarController {
  static async index(req, res) {
    res.json(req.body);
  };

  // Novos métodos
  static async insertEvent(req, res) {
    try {
      const { lead_id } = req.body;
      const kommoCalendarServices = new KommoCalendarServices(lead_id);
      const event = await kommoCalendarServices.scheduleLead();
      return res.status(200).send({ message: 'Evento inserido com sucesso', event });
    } catch (error) {
      styled.error(`[KommoCalendarController.insertEvent] Erro ao inserir evento no calendário: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao inserir evento no calendário', error: error?.message });
    }
  }

  static async updEvent(req, res) {
    try {
      const { lead_id } = req.body;
      const kommoCalendarServices = new KommoCalendarServices(lead_id);
      const event = await kommoCalendarServices.updateEvent();
      return res.status(200).send({ message: 'Evento atualizado com sucesso', event });
    } catch (error) {
      styled.error(`[KommoCalendarController.updEvent] Erro ao atualizar evento no calendário: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao atualizar evento no calendário', error: error?.message });
    }
  }
}