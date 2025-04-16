import MarketingTrackingRepository from "./src/repositories/MarketingTrackingRepository.js";
import KommoServices from "./src/services/kommo/KommoServices.js";
import OpenaiIntegrationServices from "./src/services/openaiIntegration/OpenaiIntegrationServices.js";
import KommoWebhookUtils from "./src/utils/KommoWebhookUtils.js";
import LeadUtils from "./src/utils/LeadUtils.js";
import styled from "./src/utils/log/styled.js";
import StaticUtils from "./src/utils/StaticUtils.js";

async function main() {
  // const openaiIntegration = new OpenaiIntegrationServices({
  //   auth: process.env.KOMMO_AUTH,
  //   url: process.env.KOMMO_URL,
  // });
  // const lead_id = 24410353;
  // const message = "Olá, tudo bem?";
  // await openaiIntegration.assistant(lead_id, message, "YXNzdF9SUWJRbjVoblRKNjBwZTRydU16R3hROG4");

  const marketingTrackingRepository = new MarketingTrackingRepository();

  const hash = StaticUtils.generateSimpleHash();
  const text = "Olá, tudo bem?";
  styled.info("Hash gerada:", hash);

  const hashExist = await marketingTrackingRepository.findOne({
    where: {
      hash,
    },
  });

  if (hashExist) {
    styled.warning("Hash já existe:", hash);
    return;
  } else {
    styled.success("Hash não existe:", hash);
  }

  const haveHash = KommoWebhookUtils.handleEncounterHash(
    `[ ${hash} -> *NÂO APAGUE ESSA MENSAGEM* ]\n${text}`
  );

  if (!haveHash) {
    return;
  }

  console.log("Hash encontrada:", haveHash);

}

main();