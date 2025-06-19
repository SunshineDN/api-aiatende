import KommoUtils from "../../utils/KommoUtils.js";
import styled from "../../utils/log/styled.js";
import KommoServices from "../kommo/KommoServices.js";
import OpenAIServices from "../openai/OpenAIServices.js";

/**
 * Tool/função para tratar a chamada da assistente OpenAI "especialista_intencao".
 * Detecta a intenção e atualiza a etapa do usuário no CRM a cada nova mensagem.
 * 
 * @param {Object} params
 * @param {string} params.conversation_messages - Resumo do histórico do usuário.
 * @param {string} params.lead_id - ID do lead no CRM.
 * @returns {Promise<Object>} Resultado da detecção de intenção e atualização do CRM.
 */
export async function intentionSpecialist({ conversation_messages, lead_id } = {}) {
  const prompt = `
Você é um especialista em análise de fluxo de atendimento virtual. Sua tarefa é ler e analisar o histórico de conversa entre um usuário e uma assistente virtual. A partir desse histórico, identifique em qual etapa do fluxo de atendimento o usuário se encontra. 

O fluxo é estruturado como um funil sequencial, ou seja, as etapas não voltam, apenas descem. Existem oito etapas principais, além de duas ramificações que podem ocorrer entre as etapas 7 e 8. O histórico pode conter mensagens do usuário e da assistente.

# Liste a **etapa atual** do usuário de acordo com o seguinte fluxo:

1 - Recepção Virtual: O usuário mandou mensagem pela primeira vez, uma saudação ou iniciou a conversa.  
2 - Qualificado: O usuário demonstrou interesse em continuar. Nesta etapa, é ideal capturar o nome do usuário.  
3 - Pré-agendamento (datas): O usuário mostrou desejo de visualizar ou selecionar datas.  
4 - Pré-agendamento (cadastro): O usuário escolheu uma data e está fornecendo dados.  
5 - Pré-agendamento (confirmação): O usuário já forneceu todos os dados e está confirmando os dados e a data escolhida.
6 - Agendado: O usuário confirmou o agendamento (apenas se o lead confirmar o agendamento na primeira confirmação após os agendamentos / reagendamentos, se houver duas confirmações, ele não entra nesta etapa e retorna "Fora do fluxo").
7 - Confirmação (1 etapa): O usuário confirmou a primeira etapa da vinda (geralmente 24h antes).  
8 - Confirmação (2 etapa): O usuário confirmou a segunda etapa da vinda (geralmente 3h antes).

# ⚠️ Ramificações possíveis **apenas após a etapa 6**:  
- Reagendamento: O usuário deseja reagendar. Ele permanece nesta etapa até confirmar um novo agendamento.  
- Desmarcado: O usuário expressa claramente que deseja cancelar ou desmarcar o agendamento.  

⚠️ Importante: Após entrar nas etapas "Reagendamento" ou "Desmarcado", o usuário **só pode avançar para "Agendado"** caso um novo agendamento tenha sido claramente realizado. Do contrário, permanece em "Reagendamento" ou "Desmarcado".

# ⚠️ Situações fora do fluxo direto:  
- Fora do fluxo: O usuário interrompe o fluxo com uma pergunta geral, interesse em outros serviços, mudança de assunto ou tentativa de alteração de dados/datas já fornecidos. Nessa situação, o usuário não avança nem retrocede no fluxo principal.

# Regras importantes:
- Sempre retorne **apenas a etapa mais atual e válida** com base no histórico.  
- O usuário não pode retornar a uma etapa anterior do funil.  
- Retorne o nome exato da etapa como um dos seguintes valores (retorno único e preciso, em texto):  
  "Recepção Virtual", "Qualificado", "Pré-agendamento (datas)", "Pré-agendamento (cadastro)", "Pré-agendamento (confirmação)", "Agendado", "Confirmação (1 etapa)", "Confirmação (2 etapa)", "Reagendamento", "Desmarcado" e "Fora do fluxo"`;

  const openai = new OpenAIServices();
  const response = await openai.chatCompletion({
    userMessage: `
    Histórico da conversa: ${conversation_messages.map(m => `${m.role}: ${m.content}`).join('\n')}`,
    systemMessage: prompt,
  });

  const kommo = new KommoServices({
    auth: process.env.KOMMO_AUTH,
    url: process.env.KOMMO_URL
  });
  const kommoUtils = new KommoUtils({ pipelines: await kommo.getPipelines() });

  const intent = response.toLowerCase().trim();
  let status;

  if (intent.includes('recepção virtual')) {
    status = kommoUtils.findStatusByPipelineAndName('recepção virtual', 'recepção virtual');
    styled.info(`Recepção Virtual - Intenção detectada: ${intent} - Status: ${status?.name}`);

  } else if (intent.includes('qualificado')) {
    status = kommoUtils.findStatusByPipelineAndName('qualificado', 'qualificado');
    styled.info(`Qualificado - Intenção detectada: ${intent} - Status: ${status?.name}`);

  } else if (intent.includes('pré-agendamento (datas)')) {
    status = kommoUtils.findStatusByPipelineAndName('pré-agendamento', 'pré-agendamento');
    styled.info(`Pré-Agendamento - Intenção detectada: ${intent} - Status: ${status?.name}`);

  } else if (intent.includes('pré-agendamento (cadastro)')) {
    status = kommoUtils.findStatusByPipelineAndName('pré-agendamento', 'dados cadastrais');
    styled.info(`Cadastro - Intenção detectada: ${intent} - Status: ${status?.name}`);

  } else if (intent.includes('pré-agendamento (confirmação)')) {
    status = kommoUtils.findStatusByPipelineAndName('pré-agendamento', 'confirmação');
    styled.info(`Pós-Agendamento - Intenção detectada: ${intent} - Status: ${status?.name}`);

  } else if (intent.includes('agendado')) {
    status = kommoUtils.findStatusByCode('pré-agendamento', 142);
    styled.info(`Agendamento - Intenção detectada: ${intent} - Status: ${status?.name}`);

  } else if (intent.includes('confirmação (1 etapa)')) {
    status = kommoUtils.findStatusByPipelineAndName('confirmação', 'confirmação 3h');
    styled.info(`Reagendamento - Intenção detectada: ${intent} - Status: ${status?.name}`);

  } else if (intent.includes('confirmação (2 etapa)')) {
    status = kommoUtils.findStatusByPipelineAndName('confirmação', 'lembrete 1h');
    styled.info(`Desmarcado - Intenção detectada: ${intent} - Status: ${status?.name}`);

  } else if (intent.includes('reagendamento')) {
    status = kommoUtils.findStatusByPipelineAndName('confirmação', 'reagendamento');
    styled.info(`Reagendamento - Intenção detectada: ${intent} - Status: ${status?.name}`);

  } else if (intent.includes('desmarcado')) {
    status = kommoUtils.findStatusByPipelineAndName('confirmação', 'desmarcado');
    styled.info(`Desmarcado - Intenção detectada: ${intent} - Status: ${status?.name}`);

  } else {
    styled.info(`Fora do Fluxo - Intenção detectada: ${intent}`);

  }

  if (status) {
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

  return {
    sucesso: true,
    intencaoDetectada: response,
    mensagem: 'Intenção detectada, mas não foi possível atualizar o status do lead.'
  };
};