import KommoWebhookServices from "../services/kommo/KommoWebhookServices";

export default class KommoWebhookController {
  constructor() {
    this.kommo = new KommoWebhookServices();
    this.created = this.created.bind(this);
  }

  async created(req, res) {
    try {
      const { body } = req;
      const calendarLinkResponse = await this.kommo.createLead(body?.lead_id, { calendar: true, created_at: true });
      res.status(200).json(calendarLinkResponse);
    } catch (error) {
      styled.error('[LeadController.created] Erro');
      console.error(error);
      res.status(500).json({ message: 'Erro ao processar a requisição' });
    }
  }

  async messageReceived(req, res) {
    
  }
}