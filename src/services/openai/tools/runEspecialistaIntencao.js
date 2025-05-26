import KommoUtils from "../../../utils/KommoUtils.js";
import styled from "../../../utils/log/styled.js";
import KommoServices from "../../kommo/KommoServices.js";
import OpenAIServices from "../OpenAIServices.js";

/**
 * Tool/função para tratar a chamada da assistente OpenAI "especialista_intencao".
 * Detecta a intenção e atualiza a etapa do usuário no CRM a cada nova mensagem.
 * 
 * @param {Object} params
 * @param {string} params.conversation_summary - Resumo do histórico do usuário.
 * @param {string} params.lead_id - ID do lead no CRM.
 * @returns {Promise<Object>} Resultado da detecção de intenção e atualização do CRM.
 */
export async function runEspecialistaIntencao({ conversation_summary, lead_id, intention_history } = {}) {
  if (typeof lead_id !== 'string' || !lead_id.trim()) {
    throw new Error('Parâmetro "lead_id" é obrigatório e deve ser uma string não vazia.');
  }

  const prompt = `
# Intenções do lead recebidas pelo sistema: [${intention_history.map(item => item.id).join(', ') || 'Nenhuma intenção anterior detectada.'}]

# 🎯 Objetivo  
Identificar com precisão **em qual estágio atual** do fluxo de atendimento o lead se encontra, com base em uma **mensagem-resumo da conversa completa**, retornando **apenas o ID da intenção**, no formato \`#Intencao\`, para direcionamento automatizado no CRM da Dental Santé.

## 👤 Persona  
Leads e pacientes que interagem via WhatsApp, chatbot ou CRM nas etapas do funil de atendimento odontológico da Clínica Dental Santé. A mensagem a ser analisada será **um resumo da conversa** atual com o lead.

## ⚙️ Comportamento Esperado  
- Analisar profundamente a **mensagem-resumo** enviada.  
- Considerar a **sequência lógica de evolução do lead** pelas etapas.  
- **Nunca retornar uma intenção anterior** já superada, com exceção da intenção \`#Reagendamento\`, que pode levar o lead de volta para \`#PosAgendamento\`.  
- Retornar apenas **um único ID de intenção atual** conforme a lista abaixo.  
- Avaliar a **etapa mais avançada mencionada** ou implícita na mensagem, ignorando passos anteriores.

## 🗂️ Intenções Possíveis (IDs válidos)

| ID | Descrição |
|----|-----------|
| \`#RecepcaoVirtual\` | Primeiro contato ou mensagem genérica. Sem sinais de interesse, dúvidas iniciais, saudações. |
| \`#Qualificado\` | Demonstra interesse em saber mais sobre a clínica, tratamentos, convênios ou equipe, mas **ainda não manifesta intenção de agendar**. |
| \`#InformacaoTratamento\` | Solicita informações específicas sobre tratamentos odontológicos como implantes, Invisalign, clareamento etc. |
| \`#PreAgendamento\` | Deseja agendar consulta, mas **ainda não forneceu dados nem escolheu horário**. Pode estar aguardando opções. |
| \`#Agendamento\` | Está selecionando ou confirmando data e horário para consulta. |
| \`#Cadastro\` | Está fornecendo ou disposto a fornecer **dados pessoais** (nome, telefone, nascimento, bairro). |
| \`#PosAgendamento\` | Consulta já agendada; mensagens de confirmação, lembrete ou validação de endereço. |
| \`#Reagendamento\` | Deseja remarcar uma consulta agendada ou responde a tentativa de reativação após ausência. |
| \`#Desmarcar\` | Deseja cancelar ou desmarcar a consulta agendada. |
| \`#Indefinido\` | Mensagem ambígua, vaga ou sem contexto claro. Nenhuma intenção pode ser identificada.

## 🔁 Regras de Progresso do Funil

- A intenção **nunca deve regredir**. Por exemplo:
  - Se o usuário está escolhendo data, **não pode retornar \`#Qualificado\`**, mesmo que mencione informações da clínica.
  - Se a mensagem mostra que já houve agendamento, **não pode retornar \`#Agendamento\`**, deve ser \`#PosAgendamento\`.
- **Exceção única**: Se o lead deseja reagendar (\`#Reagendamento\`), pode retornar apenas a \`#PosAgendamento\` após o reagendamento ser finalizado.

## 🧠 Regras Inteligentes

- Se a mensagem for apenas um “oi”, “boa tarde”, “posso tirar uma dúvida?”, aplicar \`#RecepcaoVirtual\`.  
- Se for apenas interesse por tratamentos, valores, equipe ou convênio, aplicar \`#Qualificado\`.  
- Se a pessoa deseja agendar, mas não forneceu dados nem confirmou horário, aplicar \`#PreAgendamento\`.  
- Se está confirmando ou decidindo data/hora, aplicar \`#Agendamento\`.  
- Se está fornecendo nome, telefone, data de nascimento, aplicar \`#Cadastro\`.  
- Se a consulta já está marcada e está interagindo com lembretes ou confirmando dados, aplicar \`#PosAgendamento\`.  
- Se quer remarcar (ou respondeu lembrete após faltar), aplicar \`#Reagendamento\`.  
- Se quer cancelar, aplicar \`#Desmarcar\`.  
- Se perguntar sobre Invisalign, implantes, clareamento, etc., aplicar \`#InformacaoTratamento\`.  
- Se não for possível identificar a intenção, aplicar \`#Indefinido\`.

## ✍️ Estilo de Resposta  
- Retornar apenas o **ID da intenção**, como \`#Agendamento\`  
- **Nunca** incluir qualquer explicação, frase adicional ou observação.  
- **Nunca** retornar mais de um ID.

## 🔒 Restrições  
- Não retornar etapas anteriores já superadas (exceto regra especial para \`#Reagendamento\`).  
- Não explicar a intenção.  
- Retornar exatamente \`#Indefinido\` se nenhuma intenção válida puder ser reconhecida.`;

  const openai = new OpenAIServices();
  const response = await openai.chatCompletion({
    userMessage: conversation_summary,
    systemMessage: prompt,
  });

  const kommo = new KommoServices({
    auth: process.env.KOMMO_AUTH,
    url: process.env.KOMMO_URL
  });
  const kommoUtils = new KommoUtils({ pipelines: await kommo.getPipelines() });

  const intent = response.toLowerCase().trim();
  let status;

  if (intent.includes('recepcao')) {
    status = kommoUtils.findStatusByName('recepção virtual');
    styled.info(`Recepção Virtual - Intenção detectada: ${intent} - Status: ${status.name}`);

  } else if (intent.includes('qualificado')) {
    status = kommoUtils.findStatusByName('qualificado');
    styled.info(`Qualificado - Intenção detectada: ${intent} - Status: ${status.name}`);

  } else if (intent.includes('tratamento')) {
    status = kommoUtils.findStatusByName('informações do tratamento');
    styled.info(`Tratamentos - Intenção detectada: ${intent} - Status: ${status.name}`);

  } else if (intent.includes('preagendamento')) {
    status = kommoUtils.findStatusByName('pré-agendamento');
    styled.info(`Pré-Agendamento - Intenção detectada: ${intent} - Status: ${status.name}`);

  }else if (intent.includes('cadastro')) {
    status = kommoUtils.findStatusByName('dados cadastrais');
    styled.info(`Cadastro - Intenção detectada: ${intent} - Status: ${status.name}`);

  } else if (intent.includes('posagendamento')) {
    status = kommoUtils.findStatusByCode('pré-agendamento', 142);
    styled.info(`Pós-Agendamento - Intenção detectada: ${intent} - Status: ${status.name}`);

  } else if (intent.includes('agendamento')) {
    status = kommoUtils.findStatusByName('pré-agendamento');
    styled.info(`Agendamento - Intenção detectada: ${intent} - Status: ${status.name}`);

  } else if (intent.includes('reagendamento')) {
    status = kommoUtils.findStatusByName('reagendamento');
    styled.info(`Reagendamento - Intenção detectada: ${intent} - Status: ${status.name}`);

  } else if (intent.includes('desmarcar')) {
    status = kommoUtils.findStatusByName('desmarcado');
    styled.info(`Desmarcado - Intenção detectada: ${intent} - Status: ${status.name}`);

  } else {
    status = kommoUtils.findStatusByName('indefinido');
    styled.info(`Indefinido - Intenção detectada: ${intent} - Status: ${status.name}`);

  }

  const update = await kommo.updateLead({
    id: lead_id,
    status_id: status.id,
    pipeline_id: status.pipeline_id
  });

  return {
    sucesso: true,
    intencaoDetectada: response,
    updateLead: update
  };
};