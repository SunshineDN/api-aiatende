import { PrismaClient } from "@prisma/client";
import LeadMessagesRepository from "./src/repositories/LeadMessagesRepository.js";
import LeadRepository from "./src/repositories/LeadRepository.js";
import MarketingTrackingRepository from "./src/repositories/MarketingTrackingRepository.js";
import EvolutionApiServices from "./src/services/evolutionapi/EvolutionApiServices.js";
import GoogleServices from "./src/services/google/GoogleServices.js";
import KommoServices from "./src/services/kommo/KommoServices.js";
import AgentManager from "./src/services/openai/AgentManager.js";
import ToolsServices from "./src/services/openai/ToolsServices.js";
import OpenaiIntegrationServices from "./src/services/openaiIntegration/OpenaiIntegrationServices.js";
import WppServices from "./src/services/wpp/WppServices.js";
import KommoWebhookUtils from "./src/utils/KommoWebhookUtils.js";
import LeadUtils from "./src/utils/LeadUtils.js";
import styled from "./src/utils/log/styled.js";
import StaticUtils from "./src/utils/StaticUtils.js";
import { withAccelerate } from "@prisma/extension-accelerate";
import LeadThreadRepository from "./src/repositories/LeadThreadRepository.js";
import { runEspecialistaAgendamento } from "./src/services/openai/tools/runEspecialistaAgendamento.js";
import OpenAIServices from "./src/services/openai/OpenAIServices.js";

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
  // const kommo = new KommoServices({
  //   auth: process.env.KOMMO_AUTH,
  //   url: process.env.KOMMO_URL,
  // });
  // const lead = await kommo.getLead({ id: 24410353 });
  // styled.info("Lead:", lead);

  // const lead_id = 24410353;
  // const message = "Me conte uma curiosidade";

  // const reply = await manager.runGroup(lead_id, message);
  // styled.info("Resposta do grupo de agentes:", reply);

  // const tools = new ToolsServices();
  // const method = StaticUtils.findMethods(tools, 'analisarIntencaoUsuario')[0];
  // styled.infodir(method);
  // tools[method]({ resumoConversa: 'teste' })

  // const prisma = new PrismaClient();
  // prisma.$extends(withAccelerate());
  // const leadThreadRepo = new LeadThreadRepository();
  // const lastTimestam = await leadThreadRepo.getLastTimestamp(24410353);
  // styled.info("Ultimo timestamp:", lastTimestam);

  const openai = new OpenAIServices({ lead_id: 24410353 });
  const userMessage = "That will pass the user USER_ID as 239482 and the USER_KEY as foobar. This is suitable for testing, however for production, you will probably be configuring some bash scripts to export variables";
  const systemMessage = "#Sempre rode a tool **getIntent**. Você é um assistente virtual. Responda em português.";

  const tools = [
    {
      type: "function",
      function: {
        name: "getIntent",
        description: "Get the intent of the user message",
        strict: true,
        parameters: {
          type: "object",
          properties: {
            intent: {
              type: "string",
            },
          },
          additionalProperties: false,
          required: ["intent"],
        },
      }
    }
  ];

  const availableTools = {
    getIntent: async (args) => {
      const { intent } = args;
      return `A intenção do usuário é: ${intent}`;
    }
  };

  const response = await openai.promptFull({ userMessage, systemMessage, availableTools, tools });
}

main();