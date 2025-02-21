import FunnelBuilderUtils from "../../utils/FunnelBuilderUtils.js";

export default class FunnelBuilderServices {
  async handleReceiveWebhook(body) {
    const { id, metadata } = body;
    const identify = FunnelBuilderUtils.getMetadata(metadata);
    return identify;
  }
}