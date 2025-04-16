import KommoServices from "./src/services/kommo/KommoServices.js";
import OpenaiIntegrationServices from "./src/services/openaiIntegration/OpenaiIntegrationServices.js";
import KommoWebhookUtils from "./src/utils/KommoWebhookUtils.js";
import LeadUtils from "./src/utils/LeadUtils.js";
import styled from "./src/utils/log/styled.js";

async function main() {
  // const openaiIntegration = new OpenaiIntegrationServices({
  //   auth: process.env.KOMMO_AUTH,
  //   url: process.env.KOMMO_URL,
  // });
  // const lead_id = 24410353;
  // const message = "Olá, tudo bem?";
  // await openaiIntegration.assistant(lead_id, message, "YXNzdF9SUWJRbjVoblRKNjBwZTRydU16R3hROG4");

  const haveHash = KommoWebhookUtils.handleEncounterHash(
    "Olá, tudo bem? Aqui está sua hash: 2cf2s4dba. Por favor, confirme."
  );

  if (!haveHash) {
    styled.info("❌ Nenhuma hash encontrada na mensagem.");
    return;
  }

  console.log("Hash encontrada:", haveHash);

}

main();