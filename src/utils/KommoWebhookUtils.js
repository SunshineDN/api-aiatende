import MarketingTrackingRepository from "../repositories/MarketingTrackingRepository.js"
import KommoServices from "../services/kommo/KommoServices.js"
import KommoUtils from "./KommoUtils.js";
import styled from "./log/styled.js";

export default class KommoWebhookUtils extends KommoUtils {
	#marketing_tracking;

	constructor({ leads_custom_fields = [], contacts_custom_fields = [], pipelines = [] } = {}) {
		super({ leads_custom_fields, contacts_custom_fields, pipelines });
		this.kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
		this.#marketing_tracking = new MarketingTrackingRepository();
	}

	/**
	 * Extrai a hash de um texto e verifica se ela é válida.
	 * @param {string} text Texto a ser analisado
	 * @returns {string} Retorna o texto sem a hash
	 */
	static handleEncounterHash(text) {
		const regex = /\b([a-f0-9]{8})\b/i;
		const resultado = text.match(regex);

		if (resultado) {
			const hashEncontrada = resultado[0];

			styled.info("✅ Hash encontrada na mensagem:", hashEncontrada);
			return hashEncontrada;
		} else {
			styled.info("❌ Nenhuma hash encontrada na mensagem.");
			return null;
		}
	}

	async handleWebhookDuplicate(lead) {
		styled.function('[KommoWebhookUtils.handleWebhookDuplicate]');
		const custom_fields = lead.custom_fields_values
		styled.infodir(custom_fields)
		const id_backup = custom_fields.filter((field) => field.field_id == 1379333)
		styled.infodir(id_backup)
		const id = id_backup[0].values[0].value;
		const utms = await this.#marketing_tracking.findOne({ where: { hash: id } })
		styled.info("utms: ")
		styled.infodir(utms)
		const custom_field_updated = this.handleCustomFields(utms)
		styled.infodir(custom_field_updated)
		const update = await this.kommo.updateLead({ id: lead.id, custom_fields_values: custom_field_updated })
		styled.infodir(update)
		return;
	}

	async handleCustomFields(utms) {

		this.leads_custom_fields = await this.kommo.getLeadsCustomFields();

		const track_message_field = this.findLeadsFieldByName('track message');
		const client_id_field = this.findLeadsFieldByName('client_id');
		const utm_source_field = this.findLeadsFieldByName('utm_source');
		const utm_campaign_field = this.findLeadsFieldByName('utm_campaign');
		const utm_content_field = this.findLeadsFieldByName('utm_content');
		const utm_medium_field = this.findLeadsFieldByName('utm_medium');
		const utm_term_field = this.findLeadsFieldByName('utm_term');
		const utm_referrer_field = this.findLeadsFieldByName('utm_referrer');
		const gclid_field = this.findLeadsFieldByName('gclid');
		const fbclid_field = this.findLeadsFieldByName('fbclid');
		const fbp_field = this.findLeadsFieldByName('fbp');

		return [
			{ field_id: track_message_field.id, values: [{ value: utms.hash }] },
			{ field_id: client_id_field.id, values: [{ value: utms.client_id }] },
			{ field_id: utm_source_field.id, values: [{ value: utms.utm_source }] },
			{ field_id: utm_campaign_field.id, values: [{ value: utms.utm_campaign }] },
			{ field_id: utm_content_field.id, values: [{ value: utms.utm_content }] },
			{ field_id: utm_medium_field.id, values: [{ value: utms.utm_medium }] },
			{ field_id: utm_term_field.id, values: [{ value: utms.utm_term }] },
			{ field_id: utm_referrer_field.id, values: [{ value: utms.utm_referrer }] },
			{ field_id: gclid_field.id, values: [{ value: utms.gclid }] },
			{ field_id: fbclid_field.id, values: [{ value: utms.fbclid }] },
			{ field_id: fbp_field.id, values: [{ value: utms.fbp }] }
		]
	}
}

