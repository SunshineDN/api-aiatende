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

	handleCustomFields(utms) {
		return [
			{ field_id: 1379289, values: [{ value: utms.client_id }] },
			{ field_id: 1379023, values: [{ value: utms.utm_source }] },
			{ field_id: 1379025, values: [{ value: utms.utm_campaign }] },
			{ field_id: 1379027, values: [{ value: utms.utm_content }] },
			{ field_id: 1379029, values: [{ value: utms.utm_medium }] },
			{ field_id: 1379291, values: [{ value: utms.gclid }] },
			{ field_id: 1379293, values: [{ value: utms.fbclid }] },
			{ field_id: 1379295, values: [{ value: utms.utm_term }] },
			{ field_id: 1379297, values: [{ value: utms.utm_referrer }] },
			{ field_id: 1379333, values: [{ value: utms.hash }] },
		]
	}
}

