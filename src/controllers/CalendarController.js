import { ListCalendarEvents } from '../services/calendar/ListCalendarEvents.js';
import { RegisterCalendarEvent } from '../services/calendar/RegisterCalendarEvent.js';
import { RemoveCalendarEvent } from '../services/calendar/RemoveCalendarEvent.js';
import { UpdateCalendarEvent } from '../services/calendar/UpdateCalendarEvent.js';
import { WebListCalendarEvents } from '../services/calendar/WebListCalendarEvents.js';
import { GetAccessToken } from '../services/kommo/GetAccessToken.js';
import { GetUser } from '../services/kommo/GetUser.js';

export default class CalendarController {
  static async index(req, res) {
    res.json(req.body);
  };

  static async teste(req, res) {
    try {
      const user = await GetUser(req.body, true);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static async listEvents(req, res) {
    try {
      const access_token = GetAccessToken();
      await ListCalendarEvents(req.body, access_token);
      res.status(200).json({ message: 'Eventos listados com sucesso!' });
    } catch (error) {
      console.error('Error on listEvents:', error);
      res.status(500).json({ error });
    }
  };

  static async listEventsWeb(req, res) {
    try {
      const options_response = await WebListCalendarEvents(req.body);
      res.status(200).json(options_response);
    } catch (error) {
      console.error('Error on listEventsWeb:', error);
      res.status(500).json({ error });
    }
  }

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