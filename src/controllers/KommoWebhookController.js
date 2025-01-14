import KommoWebhookServices from "../services/kommo/KommoWebhookServices.js";
import styled from "../utils/log/styledLog.js";

export default class KommoWebhookController {
  constructor() {
    this.kommo = new KommoWebhookServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.created = this.created.bind(this);
    this.messageReceived = this.messageReceived.bind(this);
  }

  async created(req, res) {
    try {
      const { body } = req;
      const response = await this.kommo.createLead(body?.lead_id, { calendar: true, created_at: true });
      res.status(200).json(response);
    } catch (error) {
      styled.error('[KommoWebhookController.created] Erro');
      console.error(error);
      res.status(500).json({ message: 'Erro ao processar a requisição' });
    }
  }

  async messageReceived(req, res) {
    try {
      const { body } = req;
      const response = await this.kommo.messageReceived({ lead_id: body?.lead_id, attachment: body?.attachment, text: body?.text });
      res.status(200).json(response);
    } catch (error) {
      styled.error('[KommoWebhookController.messageReceived] Erro');
      console.error(error);
      res.status(500).json({ message: 'Erro ao processar a requisição' });
    }
  }
}