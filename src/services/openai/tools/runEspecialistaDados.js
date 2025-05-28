import DateUtils from "../../../utils/DateUtils.js";
import KommoUtils from "../../../utils/KommoUtils.js";
import StaticUtils from "../../../utils/StaticUtils.js";
import KommoServices from "../../kommo/KommoServices.js";
import OpenAIServices from "../OpenAIServices.js";

export async function runEspecialistaDados({ resumo_historico = "", nome, telefone, endereco, email = "", cpf = "", tipo_cliente, empresa = "", cnpj = "", inscricao_estadual = "", responsavel = "", lead_id = "" } = {}) {
  // Definição de dados importantes baseada no tipo de cliente
  const dados_importantes_base = [
    "Nome",
    "Telefone",
    "Endereço",
    "Tipo de Cliente",
    "Responsável"
  ];
  let dados_importantes = [...dados_importantes_base];
  if (tipo_cliente === "pessoa_fisica") {
    dados_importantes.push("Email", "CPF");
  } else if (tipo_cliente === "pessoa_juridica") {
    dados_importantes.push("Empresa", "CNPJ", "Inscrição Estadual");
  }

  const userMessage = `
Aqui estão meus dados:
Nome: ${nome}
Telefone: ${telefone}
Endereço: ${endereco}
Tipo de Cliente: ${tipo_cliente}
${email ? `Email: ${email}` : ""}
${cpf ? `CPF: ${cpf}` : ""}
${empresa ? `Empresa: ${empresa}` : ""}
${cnpj ? `CNPJ: ${cnpj}` : ""}
${inscricao_estadual ? `Inscrição Estadual: ${inscricao_estadual}` : ""}
${responsavel ? `Responsável: ${responsavel}` : ""}
`;

  const prompt = `
Você é um especialista em dados e precisa analisar as informações fornecidas.

Seu objetivo é identificar e verificar se há todos os dados necessários para o atendimento.
Você deve analisar as informações do cliente e verificar se estão completas e corretas.
Você deve considerar os seguintes dados como importantes:
${dados_importantes.join(", ")}

Resumo Histórico: ${resumo_historico}
Responda de forma clara e concisa, destacando os pontos mais importantes.
Evite incluir informações irrelevantes ou redundantes.
Lembre-se de que a clareza e a precisão são fundamentais na sua análise.

System informations:
${DateUtils.getActualDatetimeInformation()}
  `;

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

  // Mapeamento de campos de acordo com os parâmetros recebidos
  if (endereco) {
    const field = kommoUtils.findLeadsFieldByName("Endereço");
    if (field) {
      lead_custom_fields.push({ field_id: field.id, values: [{ value: endereco }] });
    }
  }
  if (tipo_cliente) {
    const field = kommoUtils.findLeadsFieldByName("Tipo de Cliente");
    if (field) {
      lead_custom_fields.push({ field_id: field.id, values: [{ value: tipo_cliente }] });
    }
  }
  if (email) {
    const field = kommoUtils.findLeadsFieldByName("Email");
    if (field) {
      lead_custom_fields.push({ field_id: field.id, values: [{ value: email }] });
    }
  }
  if (cpf) {
    const field = kommoUtils.findLeadsFieldByName("CPF");
    if (field) {
      lead_custom_fields.push({ field_id: field.id, values: [{ value: cpf }] });
    }
  }
  if (empresa) {
    const field = kommoUtils.findLeadsFieldByName("Empresa");
    if (field) {
      lead_custom_fields.push({ field_id: field.id, values: [{ value: empresa }] });
    }
  }
  if (cnpj) {
    const field = kommoUtils.findLeadsFieldByName("CNPJ");
    if (field) {
      lead_custom_fields.push({ field_id: field.id, values: [{ value: cnpj }] });
    }
  }
  if (inscricao_estadual) {
    const field = kommoUtils.findLeadsFieldByName("Inscrição Estadual");
    if (field) {
      lead_custom_fields.push({ field_id: field.id, values: [{ value: inscricao_estadual }] });
    }
  }
  if (responsavel) {
    const field = kommoUtils.findLeadsFieldByName("Responsável");
    if (field) {
      lead_custom_fields.push({ field_id: field.id, values: [{ value: responsavel }] });
    }
  }

  await kommo.updateLeadComplex({
    id: lead_id,
    name: nome,
    email,
    phone: kommoUtils.formatPhone(telefone),
    phoneCode: 'MOB',
    lead_custom_fields_values: lead_custom_fields
  });

  return {
    sucesso: true,
    mensagem: "Coleta de dados concluída com sucesso.",
    dados: response,
  };
}
