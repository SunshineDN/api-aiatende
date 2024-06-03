const GetAccessToken = require('../services/kommo/GetAccessToken');
const SetActualDateHour = require('../services/kommo/SetActualDateHour');
const SplitDataFields = require('../services/kommo/SplitDataFields');
const SplitSchedulingFields = require('../services/kommo/SplitSchedulingFields');

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
};

module.exports = new LeadController();
