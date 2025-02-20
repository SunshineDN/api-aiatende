export default class FunnelBuilderUtils {

  /**
   * Identificar a resposta do Funnel Builder
   * @param {object} obj 
   * @returns {object}
   */
  static identifyAnswer(obj) {
    if (obj?.metadata?.length === 0) {
      return { type: 'not_found', value: null };
    }

    const metadata = obj.metadata;
    
    
  }
};