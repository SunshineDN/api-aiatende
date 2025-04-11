import MarketingTrackingRepository from "../repositories/MarketingTrackingRepository.js";
import KommoServices from "../services/kommo/KommoServices.js"
import styled from "./log/styled.js";

export default class KommoWebhookUtils {
    constructor(){
        this.kommo = new KommoServices();
        this.MarketingTracking= new MarketingTrackingRepository();
    }

    static async handleWebhookDuplicate(lead) {
        styled.function('[KommoWebhookUtils.handleWebhookDuplicate]');
        if(lead.contact.length == 0 || lead.contact == []){
            styled.warning("Lead Sem Contato")
            return
        }
        styled.info("Lead com contato")
        const custom_fields = lead.custom_fields_values
        const id_backup = custom_fields.filter(field => field.id === "1379333")
        const id = id_backup[0].values[0].value;
        styled.info(id)
        return id
    }
}

