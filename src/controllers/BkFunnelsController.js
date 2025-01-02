import styled from "../utils/log/styledLog.js";
import BkFunnelsServices from "../services/bkfunnels/BkFunnelsServices.js";

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

  static async registerUpdateLead(req, res) {
    try {
      styled.info('Registrando ou atualizando lead:');
      const { body } = req;
      await BkFunnelsServices.createUpdateLead(body);
    } catch (error) {
      styled.error('Error on registerUpdateLead:');
      styled.errordir(error);
      res.status(500).json({ error });
    } finally {
      res.status(200).json({ message: 'Lead registrado ou atualizado' });
    }
  };
}