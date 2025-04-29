import LeadMessagesRepository from "./src/repositories/LeadMessagesRepository.js";
import MarketingTrackingRepository from "./src/repositories/MarketingTrackingRepository.js";
import GoogleServices from "./src/services/google/GoogleServices.js";
import KommoServices from "./src/services/kommo/KommoServices.js";
import AgentManager from "./src/services/openai/AgentManager.js";
import OpenaiIntegrationServices from "./src/services/openaiIntegration/OpenaiIntegrationServices.js";
import WppServices from "./src/services/wpp/WppServices.js";
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

  // const marketingTrackingRepository = new MarketingTrackingRepository();

  // const hash = StaticUtils.generateSimpleHash();
  // const text = "Olá, tudo bem?";
  // styled.info("Hash gerada:", hash);

  // const hashExist = await marketingTrackingRepository.findOne({
  //   where: {
  //     hash,
  //   },
  // });

  // if (hashExist) {
  //   styled.warning("Hash já existe:", hash);
  //   return;
  // } else {
  //   styled.success("Hash não existe:", hash);
  // }

  // const haveHash = KommoWebhookUtils.handleEncounterHash(
  //   `[ ${hash} -> *NÂO APAGUE ESSA MENSAGEM* ]\n${text}`
  // );

  // if (!haveHash) {
  //   return;
  // }

  // console.log("Hash encontrada:", haveHash);

  // const leadMessagesRepository = new LeadMessagesRepository();
  // const lastMessages = await leadMessagesRepository.getLastMessages(19030890, 1);
  // const recentMessages = await leadMessagesRepository.getRecentMessages(19030890);

  // const leadMessages = recentMessages || lastMessages;

  // styled.info("Lead Messages:", leadMessages);

  // const wppServices = new WppServices();
  // const t = await wppServices.test();
  // styled.info("Test result:", t);
  // styled.infodir(t);

  // const googleServices = new GoogleServices({ document_id: "1spZ6lZ4R4n0qRdVDMuV_6E8_Zwh3-z9DXj7JbzQxTDk" });
  // const docContent = await googleServices.getDocumentContent();

  // styled.infodir(docContent);

  const lead_id = 24410353;
  const message = "Me conte uma curiosidade";

  const manager = new AgentManager();
  manager.addAgent({
    name: "Agente A",
    systemPrompt: `🎯 Prompt do Agente 1 — Resumidor:

Você é o Agente 1. Sua função é ler a mensagem do usuário e fazer um resumo claro e objetivo da conversa.

Instruções:

Capture os pontos principais da mensagem do usuário.

Resuma em 3 a 5 linhas, de forma neutra, sem julgamentos ou interpretações além do que foi dito.

Não responda à dúvida do usuário. Apenas faça o resumo.

Ao final, envie o resumo com o formato:`,
  });
  manager.addAgent({
    name: "Agente B",
    systemPrompt: `🎯 Prompt do Agente 2 — Respondedor

Você é o Agente 2. Sua função é ler o resumo feito pelo Agente 1 e formular a melhor resposta possível para atender ao usuário.

Instruções:

Leia com atenção o [Resumo da Conversa] enviado pelo Agente 1.

Elabore uma resposta clara, completa e amigável, focando em resolver ou orientar o que foi resumido.

Se necessário, sugira próximos passos ou faça perguntas adicionais para entender melhor o caso.

A resposta deve ser útil e direta, sempre respeitando o tom educado.`
  });

  const reply = await manager.runGroup(lead_id, message);
  styled.info("Resposta do grupo de agentes:", reply);
}

main();