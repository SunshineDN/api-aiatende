import MarketingTrackingRepository from "../repositories/MarketingTrackingRepository.js"
import KommoServices from "../services/kommo/KommoServices.js"
import styled from "./log/styled.js";

export default class KommoWebhookUtils {
    constructor(){
        this.kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
        this.marketing_tracking = new MarketingTrackingRepository();
    }

     async handleWebhookDuplicate(lead) {
        styled.function('[KommoWebhookUtils.handleWebhookDuplicate]');
        if(lead.contact.length == 0 || lead.contact == []){
            styled.warning("Lead Sem Contato")
            return
        }
        styled.info("Lead com contato")
        const custom_fields = lead.custom_fields_values
	styled.infodir(custom_fields)
        const id_backup = custom_fields.filter((field) => field.field_id == 1379333)
	styled.infodir(id_backup)
        const id = id_backup[0].values[0].value;
	const utms = await this.marketing_tracking.findById(id)
	styled.infodir(utms)
	const custom_field_updated = await this.handleCustomFields(utms)
        styled.infodir(custom_field_updated)
	const update = await this.kommo.updateLead({id:lead.id,custom_fields_values: custom_field_updated})
	styled.infodir(update)
        return update
    }

    async handleCustomFields(utms){
	const custom_fields_values = [
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

