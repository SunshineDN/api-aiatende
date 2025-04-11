import MarketingTrackingRepository from "../../repositories/MarketingTrackingRepository.js";
import styled from "../../utils/log/styled.js";
import KommoServices from "../kommo/KommoServices.js";


export default class WppServices {
  constructor(){
    this.marketing_tracking = new MarketingTrackingRepository();
    this.kommo =  new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
  }

  async handleWabhookReceived(query) {

    const utms = await this.handleUTMSeparator(query)
    styled.infodir(utms)

    const [create, _] = await this.marketing_tracking.findOrCreate({where: {client_id: utms.client_id}});
    await this.marketing_tracking.updateByClientId(create.client_id, utms);
    styled.success('UTM separated and saved in the database');

    const custom_fields_values = await this.handleCustomFields({utms}, create.id);
    styled.success('Custom fields values created');

    await this.kommo.createLead({
      pipeline_id: 8356615,
      status_id: 82573772,
      custom_fields_values
    });
    
    return create.id;
  }

  async handleWebhookDuplicate(data) {
    
    const id_lead = data.flatMap((item) => item.id)
    const custom_fields = data.flatMap((item) => item.custom_fields)
    const id_field = custom_fields.filter(field => field.id === "1379333");
    const id = id_field[0].values[0].value;
    styled.info(id)
    
    const {data: {_embedded: {contacts} = {}}} = await this.kommo.getLead({id: id_lead, with: "contacts"})
    if(contacts.length == 0 || contacts == []){
      styled.warning("Lead Sem Contato")
      return
    }
    const { data: { _embedded: { leads }}  } = await this.kommo.listLeads({query:id})
    styled.infodir(leads)
    const custom = leads.map((item) => {

      return {id: item.id,fields:item.custom_fields_values,embedded: item._embedded}
    })
    styled.info("Custom:")
    styled.infodir(custom)
    const lead_sc = custom.filter((item) => item?.embedded?.contacts?.length == 0)
    const fields = lead_sc.flatMap((item) => item.fields)
    const format_fields_sc = fields.map((item) => {
      return {
          id: item.field_id,
          value:item.values[0].value
      }
    })
    const id_sc = lead_sc.flatMap((item) => item.id)
    styled.info("Sem Contato: ")
    styled.infodir(format_fields_sc)
    styled.infodir(id_sc)
    const lead_cc = custom.filter((item)=> item?.embedded?.contacts?.length != 0)
    const fields_cc = lead_cc.flatMap((item) => item.fields)
    const format_cc = fields_cc.map((item)=> {
      return {
        id: item.field_id,
        value: item?.values[0]?.value
      }
    })
    const id_cc = lead_cc.flatMap((item)=> item.id)
    styled.info("Com Contato: ")
    styled.infodir(format_cc)
    styled.infodir(id_cc)

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
    }
    styled.infodir(utms)
    return utms
  }

  async handleCustomFields({utms},id){
    const custom_fields_values = [
      {field_id: 1379333, values: [{value: id}]},
      {field_id: 1379289, values: [{value: utms.client_id}]},
      {field_id: 1379023, values: [{value: utms.utm_source}]},
      {field_id: 1379025, values: [{value: utms.utm_campaign}]},
      {field_id: 1379027, values: [{value: utms.utm_content}]},
      {field_id: 1379029, values: [{value: utms.utm_medium}]},
      {field_id: 1379291, values: [{value: utms.gclid}]},
      {field_id: 1379293, values: [{value: utms.fbclid}]},
      {field_id: 1379295, values: [{value: utms.utm_term}]},
      {field_id: 1379297, values: [{value: utms.utm_referrer}]},
    ]
    return custom_fields_values

  }

   
}
