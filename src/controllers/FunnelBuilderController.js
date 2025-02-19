import FunnelBuilderServices from "../services/funnelbuilder/FunnelBuilderServices.js";
import styled from "../utils/log/styled.js";

export default class FunnelBuilderController {
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
  };

  // static async handleWebhook(req, res) {
  //   try {
  //     styled.info('Registrando ou atualizando lead:');
  //     const { body } = req;
  //     const status = await FunnelBuilderServices.createUpdateLead(body);
  //     return res.status(status.code).json({ response: status.response, created: status.created });
  //   } catch (error) {
  //     styled.error('[FunnelBuilderController.handleWebhook] - Error:' + error?.message);
  //     console.error(error);
  //     res.status(500).json({ error: error?.message });
  //   }
  // };
};