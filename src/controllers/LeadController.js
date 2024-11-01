const GetAccessToken = require('../services/kommo/GetAccessToken');
const HandlingError = require('../services/kommo/HandlingError');
const SetActualDateHour = require('../services/kommo/SetActualDateHour');
const SplitDataFields = require('../services/kommo/SplitDataFields');
const SplitSchedulingFields = require('../services/kommo/SplitSchedulingFields');
const AddTelephoneService = require('../services/kommo/AddTelephoneService');
const TokenizeTest = require('../services/kommo/TokenizeTest');

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

  async displayBody(req, res) {
    try {
      console.log('Displaying body:');
      console.log(req.body);
      res.json(req.body);
    } catch (error) {
      console.error('Error on displayBody:', error);
      res.status(500).json({ error });
    }
  }

  async test(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      const error = 'Error test: BAD (400)!';
      await HandlingError(req.body, access_token, `Testando tratamento de erro ${error}`);
    } catch (error) {
      console.error('Error on test:', error);
      res.status(500).json({ error });
    }
  }

  async testToken(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      await TokenizeTest(req.body, access_token, res);
    } catch (error) {
      console.error('Error on testToken:', error);
      res.status(500).json({ error });
    }
  }
};

module.exports = new LeadController();
