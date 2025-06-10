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
}

