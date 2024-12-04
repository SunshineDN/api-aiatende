const GetAccessToken = require('../services/kommo/GetAccessToken');
// const HandlingError = require('../services/kommo/HandlingError');
// const TokenizeTest = require('../services/kommo/TokenizeTest');
const SetActualDateHour = require('../services/kommo/SetActualDateHour');
const SplitDataFields = require('../services/kommo/SplitDataFields');
const SplitSchedulingFields = require('../services/kommo/SplitSchedulingFields');
const AddTelephoneService = require('../services/kommo/AddTelephoneService');
const SetCalendarFormService = require('../services/kommo/SetCalendarForm');

class LeadController {
  async index(req, res) {
    res.send('Hello World');
  }

  async setDataWeek(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      await SetActualDateHour(req.body, access_token);
    } catch (error) {
      console.error('Error on setDataWeek:', error);
      res.status(500).json({ error });
    }
  }

  async setSplitDataFields(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      await SplitDataFields(req.body, access_token);
    } catch (error) {
      console.error('Error on setSplitDataFields:', error);
      res.status(500).json({ error });
    }
  }

  async setSplitSchedulingFields(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      await SplitSchedulingFields(req.body, access_token);
    } catch (error) {
      console.error('Error on setSplitSchedulingFields:', error);
      res.status(500).json({ error });
    }
  }

  async addTelephone(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      await AddTelephoneService(req.body, access_token);
    } catch (error) {
      console.error('Error on setSplitSchedulingFields:', error);
      res.status(500).json({ error });
    }
  }

  async setCalendarForm(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      await SetCalendarFormService(req.body, access_token);
    } catch (error) {
      console.error('Error on setCalendarForm:', error);
      res.status(500).json({ error });
    }
  }
};

module.exports = new LeadController();
