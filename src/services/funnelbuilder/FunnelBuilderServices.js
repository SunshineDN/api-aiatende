import FunnelBuilderUtils from "../../utils/FunnelBuilderUtils";

export default class FunnelBuilderServices {
  async handleReceiveWebhook(body) {
    const { id, metadata } = body;
    const identify = FunnelBuilderUtils.identifyAnswer(metadata);
  }
}