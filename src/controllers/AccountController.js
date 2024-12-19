import { GetAccessToken } from '../services/kommo/GetAccessToken.js';
import { VerifyFieldsGpt } from '../services/kommo/VerifyFieldsGpt.js';

export default class AccountController {
  static async index(_, res) {
    res.status(200).json({ message: 'Hello World' });
  }

  static async verifyFields(req, res) {
    try {
      const access_token = GetAccessToken();
      await VerifyFieldsGpt(req.body, res, access_token);
      res.status(200).json({ message: 'Campos verificados com sucesso!' });
    } catch (error) {
      console.error('Error on verifyFields:', error);
      res.status(500).json({ error });
    }
  }
}
