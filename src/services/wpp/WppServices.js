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

    const utms = this.handleUTMSeparator(query, hash);

    if (!utms.gclientid) {
      styled.error("gclientid not found");
      return;
    }

    const [create, _] = await this.#marketing_tracking.findOrCreate({ where: { gclientid: utms.gclientid } });
    await this.#marketing_tracking.updateByClientId(create.gclientid, utms);
    styled.success('UTM separated and saved in the database');

    const custom_fields_values = await this.handleCustomFields({ utms });
    styled.success('Custom fields values created');

    const kommoWebhookUtils = new KommoWebhookUtils({ pipelines: await this.#kommo.getPipelines() });

    const pipeline = kommoWebhookUtils.findPipelineByName('01 - Recepção Virtual');
    const status = kommoWebhookUtils.findStatusByName('Clique no Site');
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
      utm_content: query.utm_content || "Não informado",
      utm_medium: query.utm_medium || "Não informado",
      utm_campaign: query.utm_campaign || "Não informado",
      utm_source: query.utm_source || "Não informado",
      utm_term: query.utm_term || "Não informado",
      utm_referrer: query.utm_referrer || "Não informado",
      referrer: query.referrer || "Não informado",
      gclientid: query.gclientid || "Não informado",
      gclid: query.gclid || "Não informado",
      fbclid: query.fbclid || "Não informado",
      ga_utm: query.ga_utm || "Não informado",
      fbp: query.fbp || "Não informado",
      fbc: query.fbc || "Não informado",
      text: query.text || "Não informado",
      hash: hash || "Não informado",
    }
    return utms
  }

  async handleCustomFields({ utms }) {

    const kommoWebhookUtils = new KommoWebhookUtils({ leads_custom_fields: await this.#kommo.getLeadsCustomFields() });

    const track_message_field = kommoWebhookUtils.findLeadsFieldByName('track message');
    const utm_content_field = kommoWebhookUtils.findLeadsFieldByName('utm_content');
    const utm_medium_field = kommoWebhookUtils.findLeadsFieldByName('utm_medium');
    const utm_campaign_field = kommoWebhookUtils.findLeadsFieldByName('utm_campaign');
    const utm_source_field = kommoWebhookUtils.findLeadsFieldByName('utm_source');
    const utm_term_field = kommoWebhookUtils.findLeadsFieldByName('utm_term');
    const utm_referrer_field = kommoWebhookUtils.findLeadsFieldByName('utm_referrer');
    const referrer_field = kommoWebhookUtils.findLeadsFieldByName('referrer');
    const gclientid = kommoWebhookUtils.findLeadsFieldByName('gclientid');
    const gclid_field = kommoWebhookUtils.findLeadsFieldByName('gclid');
    const fbclid_field = kommoWebhookUtils.findLeadsFieldByName('fbclid');
    const ga_utm_field = kommoWebhookUtils.findLeadsFieldByName('ga_utm');
    const fbp_field = kommoWebhookUtils.findLeadsFieldByName('_fbp');
    const fbc_field = kommoWebhookUtils.findLeadsFieldByName('_fbc');

    const custom_fields_values = []

    if (track_message_field) {
      custom_fields_values.push({
        field_id: track_message_field.id,
        values: [
          {
            value: utms.hash
          }
        ]
      });
    }

    if (utm_content_field) {
      custom_fields_values.push({
        field_id: utm_content_field.id,
        values: [
          {
            value: utms.utm_content
          }
        ]
      });
    }

    if (utm_medium_field) {
      custom_fields_values.push({
        field_id: utm_medium_field.id,
        values: [
          {
            value: utms.utm_medium
          }
        ]
      });
    }

    if (utm_campaign_field) {
      custom_fields_values.push({
        field_id: utm_campaign_field.id,
        values: [
          {
            value: utms.utm_campaign
          }
        ]
      });
    }

    if (utm_source_field) {
      custom_fields_values.push({
        field_id: utm_source_field.id,
        values: [
          {
            value: utms.utm_source
          }
        ]
      });
    }

    if (utm_term_field) {
      custom_fields_values.push({
        field_id: utm_term_field.id,
        values: [
          {
            value: utms.utm_term
          }
        ]
      });
    }

    if (utm_referrer_field) {
      custom_fields_values.push({
        field_id: utm_referrer_field.id,
        values: [
          {
            value: utms.utm_referrer
          }
        ]
      });
    }

    if (referrer_field) {
      custom_fields_values.push({
        field_id: referrer_field.id,
        values: [
          {
            value: utms.referrer
          }
        ]
      });
    }

    if (gclientid) {
      custom_fields_values.push({
        field_id: gclientid.id,
        values: [
          {
            value: utms.gclientid
          }
        ]
      });
    }

    if (gclid_field) {
      custom_fields_values.push({
        field_id: gclid_field.id,
        values: [
          {
            value: utms.gclid
          }
        ]
      });
    }

    if (fbclid_field) {
      custom_fields_values.push({
        field_id: fbclid_field.id,
        values: [
          {
            value: utms.fbclid
          }
        ]
      });
    }

    if (ga_utm_field) {
      custom_fields_values.push({
        field_id: ga_utm_field.id,
        values: [
          {
            value: utms.ga_utm
          }
        ]
      });
    }

    if (fbp_field) {
      custom_fields_values.push({
        field_id: fbp_field.id,
        values: [
          {
            value: utms.fbp
          }
        ]
      });
    }

    if (fbc_field) {
      custom_fields_values.push({
        field_id: fbc_field.id,
        values: [
          {
            value: utms.fbc
          }
        ]
      });
    }

    return custom_fields_values
  }
}
