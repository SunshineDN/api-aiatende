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

| ID                | Descrição                                                                                   |
|-------------------|---------------------------------------------------------------------------------------------|
| \`#RecepcaoVirtual\`    | Primeiro contato, saudações ou dúvidas iniciais sem interesse claro.                        |
| \`#Qualificado\`        | Interesse geral em tratamentos, convênios, equipe, mas sem intenção de agendar.          |
| \`#InformacaoTratamento\` | Pedido específico sobre tratamentos (implantes, clareamento, Invisalign, etc.).          |
| \`#PreAgendamento\`     | Desejo de agendar, porém sem dados ou escolha de horário definida.                        |
| \`#Agendamento\`        | Seleção ou confirmação de data e horário para consulta.                                  |
| \`#Cadastro\`           | Fornecimento de dados pessoais para agendamento (nome, telefone, nascimento, bairro).    |
| \`#PosAgendamento\`     | Consulta agendada; confirmações, lembretes, validações de endereço.                       |
| \`#Reagendamento\`      | Pedido para remarcar consulta ou resposta a tentativa de reativação após ausência.        |
| \`#Desmarcar\`          | Solicitação de cancelamento ou desmarcação da consulta.                                  |
| \`#Indefinido\`         | Mensagem vaga, ambígua ou sem intenção clara.                                            |

## 🔁 Regras adicionais  
- Se o histórico estiver vazio, o lead deve começar obrigatoriamente por \`#RecepcaoVirtual\`.  
- Caso o lead já tenha passado por etapas anteriores, ele só pode repetir a última etapa ou avançar para a próxima imediatamente posterior.  
- Exceção especial: a partir de \`#Reagendamento\`, o lead pode retornar a \`#PosAgendamento\` após reagendar.  
- Mensagens genéricas como “oi”, “posso tirar dúvida?” retornam \`#RecepcaoVirtual\`.  
- Interesse genérico em tratamentos/convênios retorna \`#Qualificado\`.  
- Pedidos específicos de tratamento retornam \`#InformacaoTratamento\`.  
- Desejo de agendar sem dados retorna \`#PreAgendamento\`.  
- Escolha/confirmar horário retorna \`#Agendamento\`.  
- Fornecimento de dados pessoais retorna \`#Cadastro\`.  
- Consulta já agendada e confirmação retorna \`#PosAgendamento\`.  
- Pedido para remarcar retorna \`#Reagendamento\`.  
- Pedido para cancelar retorna \`#Desmarcar\`.  
- Caso não seja possível identificar a intenção, retorne \`#Indefinido\`.

## ✍️ Formato da resposta  
- Retorne **apenas o ID da intenção atual**, no formato \`#Intencao\`.  
- **Nunca inclua explicações, múltiplas intenções ou qualquer texto adicional.**`;

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

  } else if (intent.includes('tratamento')) {
    status = kommoUtils.findStatusByName('informações do tratamento');
    styled.info(`Tratamentos - Intenção detectada: ${intent} - Status: ${status.name}`);

  } else if (intent.includes('preagendamento')) {
    status = kommoUtils.findStatusByName('pré-agendamento');
    styled.info(`Pré-Agendamento - Intenção detectada: ${intent} - Status: ${status.name}`);

  } else if (intent.includes('cadastro')) {
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