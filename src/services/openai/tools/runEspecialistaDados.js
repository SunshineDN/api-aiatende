import DateUtils from "../../../utils/DateUtils.js";
import KommoUtils from "../../../utils/KommoUtils.js";
import StaticUtils from "../../../utils/StaticUtils.js";
import KommoServices from "../../kommo/KommoServices.js";
import OpenAIServices from "../OpenAIServices.js";

export async function runEspecialistaDados({ resumo_historico, nome = "", bairro = "", data_nascimento = "", email = "", telefone = "", lead_id = "" } = {}) {

  const dados_importantes = [
    "Nome",
    "Bairro",
    "Data de Nascimento",
    "Email",
    "Número de Telefone (Telefone)",
  ];

  const userMessage = `
Aqui estão meus dados:
Nome: ${nome}
Bairro: ${bairro}
Data de Nascimento: ${data_nascimento}
Email: ${email}
Número de Telefone: ${telefone}`;

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
  Se não houver informações relevantes, responda "Nenhuma informação relevante encontrada".

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

  if (bairro) {
    const bairroField = kommoUtils.findLeadsFieldByName("Bairro");
    if (bairroField) {
      lead_custom_fields.push({ field_id: bairroField.id, values: [{ value: bairro }] });
    }
  }

  if (data_nascimento) {
    const dataNascimentoField = kommoUtils.findLeadsFieldByName("Data de Nascimento");
    if (dataNascimentoField) {
      const validDate = DateUtils.formatDateToSeconds(StaticUtils.normalizeDate(data_nascimento), 'DD/MM/YYYY');
      if (validDate) {
        lead_custom_fields.push({ field_id: dataNascimentoField.id, values: [{ value: validDate }] });
      }
    }
  }

  await kommo.updateLeadComplex({
    id: lead_id,
    name: nome,
    email,
    phone: kommoUtils.formatPhone(telefone),
    lead_custom_fields_values: lead_custom_fields
  });

  return {
    sucesso: true,
    mensagem: "Análise de dados concluída com sucesso.",
    dados: response,
  };
}