import MarketingTrackingRepository from "../repositories/MarketingTrackingRepository.js";
import styled from "../utils/log/styled.js";


export default class WppController {

  /**
    * @param { import('express').Request } req
    * @param { import('express').Response } res
    */
  static async handleWabhookReceived(req, res) {
    const { query } = req;
    styled.info('Query:');
    styled.infodir(query);
    const obj = {
      gclid: query.gclid || "Não informado",
      fbclid: query.fbclid || "Não informado",
      utm_source: query.utm_source || "Não informado",
      utm_medium: query.utm_medium || "Não informado",
      utm_campaign: query.utm_campaign || "Não informado",
      utm_term: query.utm_term || "Não informado",
      utm_content: query.utm_content || "Não informado",
      utm_referrer: query.utm_referrer || "Não informado",
      client_id: query.client_id || "Não informado",
    }

    const marketing_tracking = new MarketingTrackingRepository();
    const [test, created] = await marketing_tracking.findOrCreate({where: {client_id: query.client_id}});
    console.log(test);
    console.log(created);
    
    
    

    res.redirect(`https://wa.me/558130930133?source=${hash}`);
  }

  static async handleMessageUpsert(req, res) {
    res.status(200).send('ok');
  }
}