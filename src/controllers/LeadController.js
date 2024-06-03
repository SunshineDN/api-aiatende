const GetAccessToken = require('../services/kommo/GetAccessToken');
const SetActualDateHour = require('../services/kommo/SetActualDateHour');
const SplitFields = require('../services/kommo/SplitFields');

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

  async setSplitFields(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      await SplitFields(req.body, access_token);
    } catch (error) {
      console.error('Error on setSplitFields:', error);
      res.status(500).json({ error });
    }
  }
};

module.exports = new LeadController();
