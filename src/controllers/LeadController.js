import { GetAccessToken } from '../services/kommo/GetAccessToken.js';
import { SetActualDateHour } from '../services/kommo/SetActualDateHour.js';
import { SplitDataFields } from '../services/kommo/SplitDataFields.js';
import { SplitSchedulingFields } from '../services/kommo/SplitSchedulingFields.js';
import { AddTelephoneService } from '../services/kommo/AddTelephoneService.js';
import KommoServices from '../services/kommo/KommoServices.js';
import styled from '../utils/log/styledLog.js';

export default class LeadController {
  constructor() {
    this.kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.index = this.index.bind(this);
    this.setDataWeek = this.setDataWeek.bind(this);
    this.setSplitDataFields = this.setSplitDataFields.bind(this);
    this.setSplitSchedulingFields = this.setSplitSchedulingFields.bind(this);
    this.addTelephone = this.addTelephone.bind(this);
    this.setCalendarLink = this.setCalendarLink.bind(this);
  }

  async index(req, res) {
    res.send('Hello World');
  }

  async setDataWeek(req, res) {
    try {
      const access_token = GetAccessToken();
      await SetActualDateHour(req.body, access_token);
      res.status(200).json({ message: 'Data setted' });
    } catch (error) {
      console.error('Error on setDataWeek:', error);
      res.status(500).json({ error });
    }
  }

  async setSplitDataFields(req, res) {
    try {
      const access_token = GetAccessToken();
      await SplitDataFields(req.body, access_token);
      res.status(200).json({ message: 'Data setted' });
    } catch (error) {
      console.error('Error on setSplitDataFields:', error);
      res.status(500).json({ error });
    }
  }

  async setSplitSchedulingFields(req, res) {
    try {
      const access_token = GetAccessToken();
      await SplitSchedulingFields(req.body, access_token);
      res.status(200).json({ message: 'Data setted' });
    } catch (error) {
      console.error('Error on setSplitSchedulingFields:', error);
      res.status(500).json({ error });
    }
  }

  async addTelephone(req, res) {
    try {
      const access_token = GetAccessToken();
      await AddTelephoneService(req.body, access_token);
      res.status(200).json({ message: 'Data setted' });
    } catch (error) {
      console.error('Error on setSplitSchedulingFields:', error);
      res.status(500).json({ error });
    }
  }

  async setCalendarLink(req, res) {
    try {
      const { body } = req;
      const calendarLinkResponse = await this.kommo.createCalendarLink(body?.lead_id);
      styled.success('[LeadController.setCalendarLink] Link do calendário criado com sucesso');
      res.status(200).json(calendarLinkResponse);
    } catch (error) {
      styled.error('[LeadController.setCalendarLink] Erro');
      console.error(error);
      res.status(500).json({ message: 'Erro ao processar a requisição' });
    }
  }
};