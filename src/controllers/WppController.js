import WppServices from "../services/wpp/WppServices.js";
import styled from "../utils/log/styled.js";
import StaticUtils from "../utils/StaticUtils.js";


export default class WppController {
  constructor() {
    this.wppServices = new WppServices();
  }
  /**
    * @param { import('express').Request } req
    * @param { import('express').Response } res
    */
  async handleWebhookReceived(req, res) {
    try {
      const whatsAppNumber = process.env.WHATSAPP_NUMBER; // Número do WhatsApp no padrao 558112345678
      const { query } = req;
      styled.infodir(query);
      const hash = StaticUtils.generateSimpleHash();
      const text = await this.wppServices.handleWebhookReceived(query, hash);
      styled.success('Webhook received and handled');
      res.redirect(`https://wa.me/${whatsAppNumber}?text=[ ${hash} ]\n${text}`);
    } catch (error) {
      styled.error('Error in webhook', error);
      res.status(500).send('Internal Server Error');
      return;
    }
  }

  async handleWebhookDuplicate(req, res) {
    try {
      const { leads: { add } } = req.body;
      styled.infodir(add);
      await this.wppServices.handleWebhookDuplicate(add);
      return res.status(200).json({ message: "Tratamento de duplicata realizado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
      return;
    }
  }

  static async handleMessageUpsert(req, res) {
    res.status(200).send('ok');
  }
}
