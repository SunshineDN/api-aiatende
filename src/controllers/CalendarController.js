import { RegisterCalendarEvent } from '../services/calendar/RegisterCalendarEvent.js';
import { RemoveCalendarEvent } from '../services/calendar/RemoveCalendarEvent.js';
import { UpdateCalendarEvent } from '../services/calendar/UpdateCalendarEvent.js';
import { GetAccessToken } from '../services/kommo/GetAccessToken.js';

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
}