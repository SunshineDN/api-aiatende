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
 * @param {Array} params.intention_history - Histórico de intenções do lead.
 * @returns {Promise<Object>} Resultado da detecção de intenção e atualização do CRM.
 */
export async function runEspecialistaIntencao({ conversation_summary, lead_id, intention_history } = {}) {
  if (typeof lead_id !== 'string' || !lead_id.trim()) {
    throw new Error('Parâmetro "lead_id" é obrigatório e deve ser uma string não vazia.');
  }

  const prompt = `
# Histórico de intenções anteriores do lead: [${intention_history.length > 0 ? intention_history.map(i => i.id).join(', ') : 'Nenhuma intenção anterior detectada.'}]

# 🎯 Objetivo  
Com base na mensagem-resumo da conversa atual do lead, identificar **exclusivamente o ID da intenção correspondente ao estágio mais avançado do funil**, respeitando a ordem sequencial das intenções já registradas e evitando retrocessos no fluxo, exceto no caso de \`#Reagendamento\`.

## 👤 Persona  
Leads e pacientes interagindo via WhatsApp, chatbot ou CRM no funil odontológico da Dental Santé.

## ⚙️ Instruções para análise  
1. Considere o histórico de intenções já registradas para o lead e avalie qual etapa ele atingiu até o momento.  
2. A mensagem-resumo reflete o contexto atual — retorne **apenas a intenção atual válida**: ou repita a última etapa válida, ou avance para a próxima etapa lógica no funil.  
3. **Não retorne nenhuma etapa anterior já superada**, exceto para \`#Reagendamento\` que pode levar a \`#PosAgendamento\`.  
4. Aplique as definições de intenções abaixo para identificar a etapa correta, respeitando a progressão sequencial do funil.

## 🗂️ Fluxo sequencial de intenções e critérios  

| ID | Descrição |
|----|-----------|
| \`#RecepcaoVirtual\` | Primeiro contato ou mensagem genérica. Sem sinais de interesse, dúvidas iniciais, saudações. |
| \`#Qualificado\` | Demonstra interesse em saber mais sobre a empresa, produtos, serviços, combos, valores, etc. |
| \`#Indefinido\` | Mensagem ambígua, vaga ou sem contexto claro. Nenhuma intenção pode ser identificada.

## 🧠 Regras Inteligentes

- Se a mensagem for apenas um “oi”, “boa tarde”, “posso tirar uma dúvida?”, aplicar \`#RecepcaoVirtual\`.  
- Se for apenas interesse por tratamentos, valores, equipe ou convênio, aplicar \`#Qualificado\`.  
- Se não for possível identificar a intenção, aplicar \`#Indefinido\`.

## ✍️ Estilo de Resposta  
- Retornar apenas o **ID da intenção**, como \`#Qualificado\`  
- **Nunca** incluir qualquer explicação, frase adicional ou observação.  
- **Nunca** retornar mais de um ID.

## 🔒 Restrições  
- Não retornar etapas anteriores já superadas.  
- Não explicar a intenção.  
- Retornar exatamente \`#Indefinido\` se nenhuma intenção válida puder ser reconhecida.`;

  const openai = new OpenAIServices();
  const response = await openai.chatCompletion({
    userMessage: `
    Resumo da conversa atual do lead: ${conversation_summary}`,
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

  }  else {
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