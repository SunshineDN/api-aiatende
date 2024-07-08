const ListCalendarDate = require('../services/calendar/ListCalendarDate');
const ListCalendarEvents = require('../services/calendar/ListCalendarEvent');
const RegisterCalendarEvent = require('../services/calendar/RegisterCalendarEvent');
const RemoveCalendarEvent = require('../services/calendar/RemoveCalendarEvent');
const UpdateCalendarEvent = require('../services/calendar/UpdateCalendarEvent');
const GetAccessToken = require('../services/kommo/GetAccessToken');
const GetUser = require('../services/kommo/GetUser');

class CalendarController {
  async index(req, res) {
    res.json(req.body);
  };

  async teste(req, res) {
    try {
      const user = await GetUser(req.body, true);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  async listEvents(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      await ListCalendarEvents(req.body, access_token);
    } catch (error) {
      console.error('Error on listEvents:', error);
      res.status(500).json({ error });
    }
  };
  async list (req,res){
    try {
      await ListCalendarDate();
    } catch (error) {
      console.error('Error on listEvents:', error);
      res.status(500).json({ error });
    }
  }

  async addEvent(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      await RegisterCalendarEvent(req.body, access_token);
    } catch (error) {
      console.error('Error on addEvent:', error);
      res.status(500).json({ error });
    }
  };

  async updateEvent(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      await UpdateCalendarEvent(req.body, access_token);
    } catch (error) {
      console.error('Error on updateEvent:', error);
      res.status(500).json({ error });
    }
  };

  async removeEvent(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      await RemoveCalendarEvent(req.body, access_token);
    } catch (error) {
      console.error('Error on removeEvent:', error);
      res.status(500).json({ error });
    }
  };
}

module.exports = new CalendarController();
