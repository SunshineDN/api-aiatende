import OpenAIServices from "../OpenAIServices.js";

export async function runEspecialistaDados({ resumo_historico, nome = "", bairro = "", data_nascimento = "", email = "", telefone = "" } = {}) {

  const dados_importantes = [
    "Nome",
    "Bairro",
    "Data de Nascimento",
    "Email",
    "Número de Telefone",
  ]

  const prompt = `Você é um especialista em dados e precisa analisar as informações fornecidas.

  Seu objetivo é identificar e verificar se há todos os dados necessários para o atendimento.
  Você deve analisar as informações do cliente e verificar se estão completas e corretas.
  Você deve considerar os seguintes dados como importantes:
  ${dados_importantes.join(", ")}

  Aqui estão os dados do cliente:
  Nome: ${nome}
  Bairro: ${bairro}
  Data de Nascimento: ${data_nascimento}
  Email: ${email}
  Número de Telefone: ${telefone}
  Resumo Histórico: ${resumo_historico}
  Responda de forma clara e concisa, destacando os pontos mais importantes.
  Evite incluir informações irrelevantes ou redundantes.
  Lembre-se de que a clareza e a precisão são fundamentais na sua análise.
  Se não houver informações relevantes, responda "Nenhuma informação relevante encontrada".
  `;
  
  const openai = new OpenAIServices();

  const response = await openai.chatCompletion({
    userMessage: resumo_historico,
    systemMessage: prompt,
  });

  return {
    sucesso: true,
    mensagem: "Análise de dados concluída com sucesso.",
    dados: response,
  };
}