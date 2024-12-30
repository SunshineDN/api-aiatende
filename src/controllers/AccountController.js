
const GetAccessToken = require('../services/kommo/GetAccessToken');
const VerifyFieldsGpt = require('../services/kommo/VerifyFieldsGpt');

class AccountController {
  async index(req, res) {
    res.status(200).json({ message: 'Hello World' });
  }

  async verifyFields(req, res) {
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      await VerifyFieldsGpt(req.body, res, access_token);
    } catch (error) {
      console.error('Error on verifyFields:', error);
      res.status(500).json({ error });
    }
  }
}

module.exports = new AccountController();
