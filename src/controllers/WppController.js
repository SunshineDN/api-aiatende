import WppServices from "../services/wpp/WppServices.js";
import styled from "../utils/log/styled.js";


export default class WppController {
  constructor() {
    this.wppServices = new WppServices();
  }
  /**
    * @param { import('express').Request } req
    * @param { import('express').Response } res
    */
  async handleWabhookReceived(req, res) {
    try {
      const { query } = req;
      styled.infodir(query);
      const id = await this.wppServices.handleWabhookReceived(query);
      styled.success('Webhook received and handled');
      res.redirect(`https://wa.me/558130930133?source=${id}`);
    } catch (error) {
      styled.error('Error in webhook', error);
      res.status(500).send('Internal Server Error');
      return;
    }
  }

  async handleWebhookDuplicate(req,res) {
    try {
      const add = req.body;
      styled.infodir(add);
      await this.wppServices.handleWebhookDuplicate(add);
      return res.status(200).json({ message: "Tratamento de duplicata realizado com sucesso" });
    }catch (error) {
      styled.error('Error in webhook', error);
      res.status(500).send('Internal Server Error');
      return;
    }
  }
  
  static async handleMessageUpsert(req, res) {
    res.status(200).send('ok');
  }
}