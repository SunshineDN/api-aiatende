import styled from "../utils/log/styledLog.js";
import BkFunnelsService from "../services/BkFunnelsService.js";

export default class BkFunnelsController {
  static webhook(req, res) {
    try {
      styled.info('Webhook received:');
      styled.infodir(req.body);
    } catch (error) {
      styled.error('Error on webhook:');
      styled.errordir(error);
      res.status(500).json({ error });
    } finally {
      res.status(200).json({ message: 'Webhook received' });
    }
  }

  static registerUpdateLead(req, res) {
    try {
      styled.info('Registrando ou atualizando lead:');
      const { body } = req;
      const answer = BkFunnelsService.identifyAnswer(body);
    }
  };
}