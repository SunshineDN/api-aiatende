export default class FunnelBuilderUtils {
  static identifyAnswer(obj) {
    if (obj?.metadata?.length === 0) {
      return { type: 'not_found', value: null };
    }

    const metadata = obj.metadata;
    
  }
};