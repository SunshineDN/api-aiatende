const { default: KommoServices } = require("../services/kommo/KommoServices");

class KommoWebhookUtils {
    constructor(){
        this.kommo = new KommoServices();
    }

    static async handleWebhookDuplicate(data) {
        const id_lead = data.flatMap((item) => item.id)
        const lead = await this.kommo.getLead({id: id_lead, withParams: "contacts"})
        if(lead.contact.length == 0 || lead.contact == []){
            styled.warning("Lead Sem Contato")
            return
        }
        const custom_fields = lead.custom_fields_values
        styled.info("Lead com contato")
        styled.infodir(lead)
        return
    }
}

module.exports = KommoWebhookUtils;