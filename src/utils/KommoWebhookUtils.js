import MarketingTrackingRepository from "../repositories/MarketingTrackingRepository";
import KommoServices from "../services/KommoServices.js";
import styled from "./log/styled.js";

class KommoWebhookUtils {
    constructor(){
        this.kommo = new KommoServices();
        this.marketing_tracking = new MarketingTrackingRepository();
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

module.exports = KommoWebhookUtils;