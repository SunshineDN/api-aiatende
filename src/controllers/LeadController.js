import KommoServices from '../services/kommo/KommoServices.js';
import styled from '../utils/log/styled.js';

export default class LeadController {
  constructor() {
    this.kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.webhookCreate = this.webhookCreate.bind(this);
  }

  async index(req, res) {
    res.send('Hello World');
  }

  async webhookCreate(req, res) {
    try {
      const { body } = req;
      const calendarLinkResponse = await this.kommo.webhookCreate(body?.lead_id, { calendar: true, created_at: true });
      res.status(200).json(calendarLinkResponse);
    } catch (error) {
      styled.error('[LeadController.webhookCreate] Erro');
      console.error(error);
      res.status(500).json({ message: 'Erro ao processar a requisição' });
    }
  }
};