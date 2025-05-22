// utils/openaiThreads.js
// const { Op } = require('sequelize');
// const { lead_threads } = require('../models');
// const OpenAIFirstController = require('./OpenAIFirstController');
// const { openai } = require('../services/openai');

import { Op } from 'sequelize';
import models from '../models/index.js';
import OpenAIFirstController from '../controllers/OpenAIFirstController.js';
import { openai } from '../services/gpt/AuthenticateOpenAI.js';

const lead_threads = models.LeadThread;
const DEFAULT_POLL_INTERVAL = 1000; // ms
const MAX_POLL_ATTEMPTS = 10;
const MAX_RUN_RETRIES = 6;

/**
 * Encontra ou cria um thread para o lead e assistant especificados.
 * @param {number|string} leadID 
 * @param {string} assistantIdRaw base64
 * @returns {Promise<{ threadID: string, assistantIndex: number }>}
 */
async function ensureThread(leadID, assistantIdRaw) {
  const assistant = Buffer.from(assistantIdRaw, 'base64').toString('utf-8');

  let thread = await lead_threads.findOne({
    where: { leadID, assistant_id: { [Op.contains]: [assistant] } }
  });

  if (!thread) {
    await OpenAIFirstController.createThread(leadID, assistant);
    thread = await lead_threads.findOne({
      where: { leadID, assistant_id: { [Op.contains]: [assistant] } }
    });
  }

  const idx = thread.assistant_id.indexOf(assistant);
  return { threadID: thread.threadID[idx], assistant };
}

/**
 * Envia uma mensagem de usuário ao thread do OpenAI.
 * @param {string} threadID 
 * @param {string} content 
 */
async function sendUserMessage(threadID, content) {
  await openai.beta.threads.messages.create(threadID, {
    role: 'user',
    content: content || '[]',
  });
}

/**
 * Cria um run no thread e aguarda até completar, falhar ou expirar.
 * Tenta cancelar e reexecutar até MAX_RUN_RETRIES vezes.
 * @param {string} threadID 
 * @param {string} assistantIdRaw
 */
async function runWithPolling(threadID, assistantIdRaw) {
  for (let attempt = 1; attempt <= MAX_RUN_RETRIES; attempt++) {
    // Inicia um run
    const assistant_id = Buffer.from(assistantIdRaw, 'base64').toString('utf-8');

    let run = await openai.beta.threads.runs.create(threadID, { assistant_id });

    // Polling com intervalo incremental
    for (let i = 1; i <= MAX_POLL_ATTEMPTS; i++) {
      await new Promise(r => setTimeout(r, DEFAULT_POLL_INTERVAL));
      run = await openai.beta.threads.runs.retrieve(threadID, run.id);

      if (run.status === 'completed') {
        return;
      }
      if (['failed', 'expired'].includes(run.status) && attempt === MAX_RUN_RETRIES && i === MAX_POLL_ATTEMPTS) {
        throw new Error(`Run ended with status: ${run.status} (${run.last_error?.message || 'no details'})`);
      }
    }

    // Se não completou no prazo, cancela e tenta novamente
    await openai.beta.threads.runs.cancel(threadID, run.id);
    // aguardar confirmação de cancelamento
    let status;
    do {
      await new Promise(r => setTimeout(r, DEFAULT_POLL_INTERVAL));
      const tmp = await openai.beta.threads.runs.retrieve(threadID, run.id);
      status = tmp.status;
    } while (!['cancelled', 'expired', 'failed'].includes(status));
  }
}

/**
 * Lista as mensagens do thread e retorna o texto da resposta mais recente.
 * @param {string} threadID 
 * @returns {Promise<string>}
 */
async function fetchLatestAssistantMessage(threadID) {
  const resp = await openai.beta.threads.messages.list(threadID);
  return resp?.data?.[0]?.content?.[0]?.text?.value || '';
}

export {
  ensureThread,
  sendUserMessage,
  runWithPolling,
  fetchLatestAssistantMessage
}