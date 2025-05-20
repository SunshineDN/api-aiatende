import styled from "../../../utils/log/styled.js";

/**
 * Tool/função para tratar a chamada da assistente OpenAI "especialista_intencao".
 * Detecta a intenção e atualiza a etapa do usuário no CRM a cada nova mensagem.
 * 
 * @param {Object} params
 * @param {string} params.history - Resumo do histórico do usuário.
 * @returns {Promise<Object>} Resultado da detecção de intenção e atualização do CRM.
 */
export async function runEspecialistaAgendamento({ history }) {
  if (typeof history !== 'string' || !history.trim()) {
    throw new Error('Parâmetro "history" é obrigatório e deve ser uma string não vazia.');
  }

  const prompt = `
  # 🎯 Objetivo
Identificar a intenção principal de um lead ou cliente com base em sua mensagem, retornando **apenas o ID da intenção**, no formato "#Intencao".

## 👤 Persona
Leads e clientes que interagem via WhatsApp, chatbot ou CRM, em diferentes etapas do funil do Atende360.

## ⚙️ Comportamento Esperado
- Analisar o conteúdo textual da mensagem.
- Identificar em qual etapa do fluxo a intenção se encaixa.
- Retornar apenas o ID da intenção correspondente, conforme lista abaixo.

## 🗂️ Intenções Possíveis (IDs válidos)
- "#RecepcaoVirtual" → Primeiro contato, dúvidas iniciais, cadastro básico.
- "#Qualificado" → Demonstra interesse, responde perguntas, quer saber mais.
- "#PreAgendamento" → Deseja atendimento, mas sem horário definido.
- "#Agendamento" → Solicita ou confirma data e hora.
- "#EmAtendimento" → Já está em atendimento, conversando com especialista.
- "#Compra" → Fechou o serviço ou quer comprar novamente.

## ✍️ Estilo de Resposta
- Apenas o ID da intenção.
- Sem explicações ou textos adicionais.
- Case sensitivity opcional, mas manter o padrão com "#CamelCase".

## 🔒 Restrições
- Nunca retorne mensagens explicativas.
- Nunca inclua múltiplos IDs.
- Caso não identifique nenhuma intenção válida, retorne "#Indefinido".
`;

  styled.info('Prompt para detectar intenção:', prompt);

  // Exemplo: lógica para detectar intenção (mock)
  // Em produção, integre com modelo de IA ou regras de negócio
  let detectedIntent = 'agendar_consulta';


  // Exemplo: atualizar etapa do usuário no CRM (mock)
  // Substitua por integração real com o CRM
  const crmUpdateResult = {
    etapaAtualizada: true,
    novaEtapa: detectedIntent,
  };

  return {
    sucesso: true,
    intencaoDetectada: detectedIntent,
    crm: crmUpdateResult,
  };
};