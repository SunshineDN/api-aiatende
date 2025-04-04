import FunnelBuilderUtils from "../../utils/FunnelBuilderUtils.js";
import styled from "../../utils/log/styled.js";

export default class FunnelBuilderServices {
  async handleReceiveWebhook(body) {
    const { id, metadata } = body;
    const identify = FunnelBuilderUtils.getMetadata(metadata);
    styled.info('Identify:');
    styled.infodir(identify);
    return identify;
  }
}