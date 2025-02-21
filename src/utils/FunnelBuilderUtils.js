import { sections, values } from "../config/funnel_builder_options.js";

export default class FunnelBuilderUtils {

  /**
   * Identificar a resposta do Funnel Builder
   * @param {object} obj 
   * @returns {object}
   */
  static getMetadata(obj) {
    if (obj?.metadata?.length === 0) {
      return { type: 'not_found', value: null };
    }

    const metadata = obj.metadata;

    if (metadata.length >= 5) {
      const leadData = {};

      metadata.forEach((item) => {
        const uuid = Object.keys(item)[0];
        const value = item[uuid];
        const fieldName = sections[uuid] || `Campo não identificado: ${uuid}`;
        leadData[fieldName] = value;
      });

      return { type: 'register', value: metadata };
    }

    const uuid = Object.keys(metadata[0])[0];
    const valueUUID = metadata[0][uuid];

    const sectionName = sections[uuid];
    const valueName = valueUUID.map((item) => values[item] || `Campo não identificado: ${item}`);

    return { type: sectionName, value: valueName };
  }
};