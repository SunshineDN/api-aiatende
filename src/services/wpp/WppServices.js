import MarketingTrackingRepository from "../../repositories/MarketingTrackingRepository.js";
import KommoWebhookUtils from "../../utils/KommoWebhookUtils.js";
import styled from "../../utils/log/styled.js";
import KommoServices from "../kommo/KommoServices.js";

export default class WppServices {
  #marketing_tracking;
  #kommo;

  constructor() {
    this.#marketing_tracking = new MarketingTrackingRepository();
    this.#kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
  }

  async handleWebhookReceived(query, hash) {

    const utms = this.handleUTMSeparator(query, hash)

    const [create, _] = await this.#marketing_tracking.findOrCreate({ where: { client_id: utms.client_id } });
    await this.#marketing_tracking.updateByClientId(create.client_id, utms);
    styled.success('UTM separated and saved in the database');

    const custom_fields_values = await this.handleCustomFields({ utms });
    styled.success('Custom fields values created');

    const kommoWebhookUtils = new KommoWebhookUtils({ pipelines: await this.#kommo.getPipelines() });

    const pipeline = kommoWebhookUtils.findPipelineByName('ENTRADA WHATSAPP');
    const status = kommoWebhookUtils.findStatusByName('Entrada whatsapp');
    if (!pipeline || !status) {
      styled.error("Pipeline or status not found");
      return;
    }

    styled.success("Lead created successfully");
    await this.#kommo.createLead({
      pipeline_id: pipeline.id,
      status_id: status.id,
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

    const leads = await this.#kommo.getLead({ id: id_lead, withParams: "contacts" })
    styled.infodir(leads)
    if (leads.contact.length == 0 || leads.contact == []) {
      styled.warning("Lead Sem Contato")
      return
    }
    styled.info("Lead com contato")
    styled.infodir(leads)
    return res.status(200)
  }

  handleUTMSeparator(query, hash) {
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
      fbp: query.fbp || "Não informado",
      hash: hash || "Não informado",
    }
    return utms
  }

  async handleCustomFields({ utms }) {

    const kommoWebhookUtils = new KommoWebhookUtils({ leads_custom_fields: await this.#kommo.getLeadsCustomFields() });

    const track_message_field = kommoWebhookUtils.findLeadsFieldByName('track message');
    const client_id_field = kommoWebhookUtils.findLeadsFieldByName('client_id');
    const utm_source_field = kommoWebhookUtils.findLeadsFieldByName('utm_source');
    const utm_campaign_field = kommoWebhookUtils.findLeadsFieldByName('utm_campaign');
    const utm_content_field = kommoWebhookUtils.findLeadsFieldByName('utm_content');
    const utm_medium_field = kommoWebhookUtils.findLeadsFieldByName('utm_medium');
    const utm_term_field = kommoWebhookUtils.findLeadsFieldByName('utm_term');
    const utm_referrer_field = kommoWebhookUtils.findLeadsFieldByName('utm_referrer');
    const gclid_field = kommoWebhookUtils.findLeadsFieldByName('gclid');
    const fbclid_field = kommoWebhookUtils.findLeadsFieldByName('fbclid');
    const fbp_field = kommoWebhookUtils.findLeadsFieldByName('fbp');

    const custom_fields_values = [
      { field_id: track_message_field.id, values: [{ value: utms.hash }] },
      { field_id: client_id_field.id, values: [{ value: utms.client_id }] },
      { field_id: utm_source_field.id, values: [{ value: utms.utm_source }] },
      { field_id: utm_campaign_field.id, values: [{ value: utms.utm_campaign }] },
      { field_id: utm_content_field.id, values: [{ value: utms.utm_content }] },
      { field_id: utm_medium_field.id, values: [{ value: utms.utm_medium }] },
      { field_id: gclid_field.id, values: [{ value: utms.gclid }] },
      { field_id: fbclid_field.id, values: [{ value: utms.fbclid }] },
      { field_id: utm_term_field.id, values: [{ value: utms.utm_term }] },
      { field_id: utm_referrer_field.id, values: [{ value: utms.utm_referrer }] },
      { field_id: fbp_field.id, values: [{ value: utms.fbp }] },
    ]
    return custom_fields_values
  }
}
