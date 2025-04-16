import MarketingTrackingRepository from "../../repositories/MarketingTrackingRepository.js";
import styled from "../../utils/log/styled.js";
import KommoServices from "../kommo/KommoServices.js";


export default class WppServices {
  constructor() {
    this.marketing_tracking = new MarketingTrackingRepository();
    this.kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
  }

  async handleWabhookReceived(query) {

    const utms = await this.handleUTMSeparator(query)
    styled.info("utms e dados")
    styled.infodir(utms)

    const [create, _] = await this.marketing_tracking.findOrCreate({ where: { client_id: utms.client_id } });
    await this.marketing_tracking.updateByClientId(create.client_id, utms);
    styled.success('UTM separated and saved in the database');

    const custom_fields_values = await this.handleCustomFields({ utms });
    styled.success('Custom fields values created');

    await this.kommo.createLead({
      pipeline_id: 8356615,
      status_id: 82573772,
      custom_fields_values
    });

    return utms.text;
  }

  async handleWebhookDuplicate(data) {

    const id_lead = data.flatMap((item) => item.id)
    const custom_fields = data.flatMap((item) => item.custom_fields)
    const id_field = custom_fields.filter(field => field.id === "1379333");
    const id = id_field[0].values[0].value;
    styled.info(id)

    const leads = await this.kommo.getLead({ id: id_lead, withParams: "contacts" })
    styled.infodir(leads)
    if (leads.contact.length == 0 || leads.contact == []) {
      styled.warning("Lead Sem Contato")
      return
    }
    styled.info("Lead com contato")
    styled.infodir(leads)
    return res.status(200)
  }

  async handleUTMSeparator(query) {
    const utms = {
      gclid: query.gclid || "Não informado",
      fbclid: query.fbclid || "Não informado",
      utm_source: query.utm_source || "Não informado",
      utm_medium: query.utm_medium || "Não informado",
      utm_campaign: query.utm_campaign || "Não informado",
      utm_term: query.utm_term || "Não informado",
      utm_content: query.utm_content || "Não informado",
      utm_referrer: query.utm_referrer || "Não informado",
      client_id: query.client_id || "Não informado",
      text: query.text || "Não informado",
      hash: query.hash || "Não informado"
    }
    return utms
  }

  async handleCustomFields({ utms }) {
    const custom_fields_values = [
      { field_id: 1379333, values: [{ value: utms.hash }] },
      { field_id: 1379289, values: [{ value: utms.client_id }] },
      { field_id: 1379023, values: [{ value: utms.utm_source }] },
      { field_id: 1379025, values: [{ value: utms.utm_campaign }] },
      { field_id: 1379027, values: [{ value: utms.utm_content }] },
      { field_id: 1379029, values: [{ value: utms.utm_medium }] },
      { field_id: 1379291, values: [{ value: utms.gclid }] },
      { field_id: 1379293, values: [{ value: utms.fbclid }] },
      { field_id: 1379295, values: [{ value: utms.utm_term }] },
      { field_id: 1379297, values: [{ value: utms.utm_referrer }] },
    ]
    return custom_fields_values
  }


}
