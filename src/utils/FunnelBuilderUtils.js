import { options } from "../config/funnel_builder_options.js";
import styled from "./log/styled.js";

export default class FunnelBuilderUtils {

  /**
   * Identificar a resposta do Funnel Builder
   * @param {object} obj 
   * @returns {object}
   */
  static getMetadata(metadata) {
    styled.info('Metadata:');
    styled.infodir(metadata);

    if (metadata?.length === 0) {
      return { type: 'not_found', value: null };
    }

    if (metadata?.length >= 5) {
      const leadData = {};

      const fieldMapping = {};
      options.forEach(option => {
        option.values.forEach(value => {
          Object.keys(value).forEach(uuid => {
            fieldMapping[uuid] = value[uuid];
          });
        });
      });

      metadata.forEach(item => {
        const uuid = Object.keys(item)[0];
        const value = item[uuid];

        if (fieldMapping[uuid]) {
          leadData[fieldMapping[uuid]] = value;
        }
      });

      return { type: 'register', value: metadata };
    }

    const uuid = Object.keys(metadata[0])[0];
    const value = metadata[0][uuid];

    const optionMapping = options.find(option => {
      return option.values.find(value => {
        return value[uuid];
      });
    });

    const valueMapping = optionMapping.values.find(value => {
      return value[uuid];
    });

    return { type: 'update', value: valueMapping[uuid] };

  }
};