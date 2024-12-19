import { GetAccessToken } from '../services/kommo/GetAccessToken.js';
import { SetActualDateHour } from '../services/kommo/SetActualDateHour.js';
import { SplitDataFields } from '../services/kommo/SplitDataFields.js';
import { SplitSchedulingFields } from '../services/kommo/SplitSchedulingFields.js';
import { AddTelephoneService } from '../services/kommo/AddTelephoneService.js';
import { SetCalendarFormService } from '../services/kommo/SetCalendarForm.js';

export default class LeadController {

  static async index(req, res) {
    res.send('Hello World');
  }

  static async setDataWeek(req, res) {
    try {
      const access_token = GetAccessToken();
      await SetActualDateHour(req.body, access_token);
      res.status(200).json({ message: 'Data setted' });
    } catch (error) {
      console.error('Error on setDataWeek:', error);
      res.status(500).json({ error });
    }
  }

  static async setSplitDataFields(req, res) {
    try {
      const access_token = GetAccessToken();
      await SplitDataFields(req.body, access_token);
      res.status(200).json({ message: 'Data setted' });
    } catch (error) {
      console.error('Error on setSplitDataFields:', error);
      res.status(500).json({ error });
    }
  }

  static async setSplitSchedulingFields(req, res) {
    try {
      const access_token = GetAccessToken();
      await SplitSchedulingFields(req.body, access_token);
      res.status(200).json({ message: 'Data setted' });
    } catch (error) {
      console.error('Error on setSplitSchedulingFields:', error);
      res.status(500).json({ error });
    }
  }

  static async addTelephone(req, res) {
    try {
      const access_token = GetAccessToken();
      await AddTelephoneService(req.body, access_token);
      res.status(200).json({ message: 'Data setted' });
    } catch (error) {
      console.error('Error on setSplitSchedulingFields:', error);
      res.status(500).json({ error });
    }
  }

  static async setCalendarForm(req, res) {
    try {
      const access_token = GetAccessToken();
      await SetCalendarFormService(req.body, access_token);
      res.status(200).json({ message: 'Data setted' });
    } catch (error) {
      console.error('Error on setCalendarForm:', error);
      res.status(500).json({ error });
    }
  }
};