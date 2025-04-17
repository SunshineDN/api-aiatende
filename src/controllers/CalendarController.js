import { RegisterCalendarEvent } from '../services/calendar/RegisterCalendarEvent.js';
import { RemoveCalendarEvent } from '../services/calendar/RemoveCalendarEvent.js';
import { UpdateCalendarEvent } from '../services/calendar/UpdateCalendarEvent.js';
import { GetAccessToken } from '../services/kommo/GetAccessToken.js';

// Novos imports
import styled from '../utils/log/styled.js';
import KommoCalendarServices from '../services/kommo/KommoCalendarServices.js';

export default class CalendarController {
  static async index(req, res) {
    res.json(req.body);
  };

  static async addEvent(req, res) {
    try {
      const access_token = GetAccessToken();
      await RegisterCalendarEvent(req.body, access_token);
      res.status(200).json({ message: 'Evento adicionado com sucesso!' });
    } catch (error) {
      console.error('Error on addEvent:', error);
      res.status(500).json({ error });
    }
  };

  static async updateEvent(req, res) {
    try {
      const access_token = GetAccessToken();
      await UpdateCalendarEvent(req.body, access_token);
      res.status(200).json({ message: 'Evento atualizado com sucesso!' });
    } catch (error) {
      console.error('Error on updateEvent:', error);
      res.status(500).json({ error });
    }
  };

  static async removeEvent(req, res) {
    try {
      const access_token = GetAccessToken();
      await RemoveCalendarEvent(req.body, access_token);
      res.status(200).json({ message: 'Evento removido com sucesso!' });
    } catch (error) {
      console.error('Error on removeEvent:', error);
      res.status(500).json({ error });
    }
  };

  // Novos métodos
  static async insertEvent(req, res) {
    try {
      const { lead_id } = req.body;
      const kommoCalendarServices = new KommoCalendarServices(lead_id);
      const event = await kommoCalendarServices.scheduleLead();
      return res.status(200).send({ message: 'Evento inserido com sucesso', event });
    } catch (error) {
      styled.error(`[CalendarController.insertEvent] Erro ao inserir evento no calendário: ${error?.message}`);
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
      styled.error(`[CalendarController.updEvent] Erro ao atualizar evento no calendário: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao atualizar evento no calendário', error: error?.message });
    }
  }
}