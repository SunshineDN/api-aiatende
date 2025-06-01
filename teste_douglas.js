import KommoServices from "./src/services/kommo/KommoServices.js";
import DateUtils from "./src/utils/DateUtils.js";
import KommoUtils from "./src/utils/KommoUtils.js";
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

  // const openai = new OpenAIServices({ lead_id: 24410353 });
  // const userMessage = "Moro em Candeias. Gostaria de agendar uma consulta. Nasci no dia 11/03/2003";
  // const systemMessage = "Rode a tool **especialista_dados** APENAS quando houver uma nova mensagem do 'user' e responda o usuário. Você é um assistente virtual. Responda em português.";

  // const tools = [
  //   {
  //     type: "function",
  //     function: {
  //       name: "especialista_dados",
  //       description: "Verifica e captura os dados do paciente.",
  //       "parameters": {
  //         "type": "object",
  //         "required": [
  //           "resumo_historico",
  //           "nome",
  //           "bairro",
  //           "data_nascimento",
  //           "email",
  //           "telefone"
  //         ],
  //         "properties": {
  //           "resumo_historico": {
  //             "type": "string",
  //             "description": "Resumo das mensagens anteriores do usuário contendo informações relevantes para o atendimento."
  //           },
  //           "nome": {
  //             "type": [
  //               "string",
  //               "null"
  //             ],
  //             "description": "Nome do usuário"
  //           },
  //           "bairro": {
  //             "type": [
  //               "string",
  //               "null"
  //             ],
  //             "description": "Bairro onde o usuárioi reside"
  //           },
  //           "data_nascimento": {
  //             "type": [
  //               "string",
  //               "null"
  //             ],
  //             "description": "Data de nascimento do usuário"
  //           },
  //           "email": {
  //             "type": [
  //               "string",
  //               "null"
  //             ],
  //             "description": "Email de contato do usuário"
  //           },
  //           "telefone": {
  //             "type": [
  //               "string",
  //               "null"
  //             ],
  //             "description": "Número de telefone do usuário"
  //           }
  //         },
  //         "additionalProperties": false
  //       }
  //     }
  //   }
  // ];

  // const availableTools = {
  //   especialista_dados: async (args) => {
  //     const { resumo_historico, nome, bairro, data_nascimento, email, telefone } = args;
  //     const response = await runEspecialistaDados(args);
  //     return `A última resposta da função é: ${JSON.stringify(response)} `;
  //   }
  // };

  // const response = await openai.promptFull({ userMessage, systemMessage, availableTools, tools });

  // const repo = new ThreadRepository({ lead_id: 24410353 });
  // await repo.deleteThread({ assistant_id: "asst_epSsBL4xTTSse7v2yqk9E4IA" })

  // const date = new Date("a");
  // if (date instanceof Date && !isNaN(date)) {
  //   styled.info("Data válida:", DateUtils.formatDate(date));
  // } else {
  //   styled.error("Data inválida: A data fornecida não é válida.");
  // }

  const kommo = new KommoServices({ 
    auth: process.env.KOMMO_AUTH,
    url: process.env.KOMMO_URL
  });
  const kommoUtils = new KommoUtils({
    pipelines: await kommo.getPipelines()
  });
  const status = kommoUtils.findStatusByPipelineAndName("qualificado", "qualificado");
  styled.infodir(status);

  // const openai = new OpenAIServices({ lead_id: 21778599 });
  // const assistant_id = atob(process.env.OPENAI_ASSISTANT_ID);
  // const userMessage = "Bom dia! Voces tem salgadinhos? Me envie o cardápio completo com preços e sabores disponíveis."; 
  // const response = await openai.handleRunAssistant({ userMessage, assistant_id });
  // styled.info("Resposta do assistente:");
  // styled.infodir(response);
}

main();