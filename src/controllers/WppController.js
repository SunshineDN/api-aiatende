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
      if (text == null) {
        styled.warning("gclientid not found");
        res.redirect(`https://wa.me/${whatsAppNumber}?text=Olá, tudo bem?`);
      } else {
        styled.success('Webhook received and handled');
        res.redirect(`https://wa.me/${whatsAppNumber}?text=[ ${hash} ]\n${text}`);
      }
    } catch (error) {
      styled.error(`[WppController.handleWebhookReceived] Error: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error', error: error?.message });
    }
  }

  /**
   * @param { import('express').Request } req
   * @param { import('express').Response } res
   */
  async handleReceiveData(req, res) {
    try {
      const whatsAppNumber = process.env.WHATSAPP_NUMBER; // Número do WhatsApp no padrao 558112345678
      const { body } = req;
      styled.infodir(body);
      const hash = StaticUtils.generateSimpleHash();
      const text = await this.wppServices.handleReceiveData(body, hash);
      if (text == null) {
        styled.warning("gclientid not found");
        res.redirect(`https://wa.me/${whatsAppNumber}?text=Olá, tudo bem?`);
      } else {
        styled.success('Webhook received and handled');
        res.redirect(`https://wa.me/${whatsAppNumber}?text=[ ${hash} ]\n${text}`);
      }
    } catch (error) {
      styled.error(`[WppController.handleReceiveData] Error: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error', error: error?.message });
    }
  }

  async handleWebhookDuplicate(req, res) {
    try {
      const { leads: { add } } = req.body;
      styled.infodir(add);
      await this.wppServices.handleWebhookDuplicate(add);
      return res.status(200).json({ message: "Tratamento de duplicata realizado com sucesso" });
    } catch (error) {
      styled.error(`[WppController.handleWebhookDuplicate] Error: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error', error: error?.message });
    }
  }

  static async handleMessageUpsert(req, res) {
    res.status(200).send('ok');
  }
}
