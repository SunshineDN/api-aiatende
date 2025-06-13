import DateUtils from "../../../utils/DateUtils.js";
import KommoUtils from "../../../utils/KommoUtils.js";
import KommoServices from "../../kommo/KommoServices.js";
import OpenAIServices from "../OpenAIServices.js";

export async function runEspecialistaDados({ nome = "", convenio = "", telefone = "", lead_id = "" } = {}) {
  const userMessage = `
Aqui estão meus dados:
Nome: ${nome}
Número de Telefone: ${telefone}
Plano de Saúde / Convênio: ${convenio}`;

  const prompt = `
  Você é um especialista em dados responsável por validar informações cadastrais fornecidas por um cliente.

  ## ✅ Objetivo:
  - Verificar se os dados obrigatórios foram informados corretamente.
  - Validar se o **plano de saúde/convênio informado é um dos aceitos** pela clínica.

  ## 📋 Dados fornecidos:
  Nome: ${nome}  
  Telefone: ${telefone}  
  Plano de Saúde / Convênio: ${convenio}

  ## 🛑 Lista de planos aceitos:
  UNIMED, AMIL, UNAFISCO, FACHESF, TRT-6, SAÚDE CAIXA, PLAN-ASSISTES, MEDISERVICE, STELLANTIS, ALLIANZ SAÚDE, CAMED, ASSEFAZ, CAPESAUDE, POSTAL SAÚDE, GEAP, BANCO CENTRAL, AMEPE/CAMPE, CONAB, PF SAÚDE, FISCO SAÚDE, EMBRATEL, LIFE, PROASA

  ## 📌 Instruções:
  - Responda de forma clara e objetiva.
  - Destaque **quais dados estão corretos** e **quais estão ausentes ou inválidos**.
  - Se o plano informado **não estiver na lista**, informe isso claramente.
  - Se **faltarem informações**, oriente que o cliente precisa completá-las.
  - Se **todos os dados estiverem corretos**, informe que está tudo pronto para seguir com o atendimento.

  ## 🕒 System Info:
  ${DateUtils.getActualDatetimeInformation()}`;


  const openai = new OpenAIServices();

  const response = await openai.chatCompletion({
    userMessage,
    systemMessage: prompt,
  });

  const kommo = new KommoServices({
    auth: process.env.KOMMO_AUTH,
    url: process.env.KOMMO_URL
  });
  const kommoUtils = new KommoUtils({ contacts_custom_fields: await kommo.getContactsCustomFields(), leads_custom_fields: await kommo.getLeadsCustomFields() });

  const lead_custom_fields = [];

  if (convenio) {
    const convenioField = kommoUtils.findLeadsFieldByName("Convênio");
    if (convenioField) {
      lead_custom_fields.push({ field_id: convenioField.id, values: [{ value: convenio }] });
    }
  }

  await kommo.updateLeadComplex({
    id: lead_id,
    name: nome,
    lead_custom_fields_values: lead_custom_fields,
    ...(telefone && { phone: kommoUtils.formatPhone(telefone) })
  });

  return {
    sucesso: true,
    mensagem: "Análise de dados concluída com sucesso.",
    dados: response,
  };
}