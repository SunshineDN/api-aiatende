import express from 'express';
const router = express.Router();

// Roteamento para as subpastas de /gpt/v2/confirmacao
import confirmacaoAssistenteRouter from './confirmacao/assistente/index.js';
import confirmacaoPromptRouter from './confirmacao/prompt/index.js';
router.use('/confirmacao/assistant', confirmacaoAssistenteRouter);
router.use('/confirmacao/prompt', confirmacaoPromptRouter);

// Roteamento para as subpastas de /gpt/v2/cutucada
import cutucadaAssistenteRouter from './cutucada/assistente/index.js';
import cutucadaPromptRouter from './cutucada/prompt/index.js';
router.use('/cutucada/assistant', cutucadaAssistenteRouter);
router.use('/cutucada/prompt', cutucadaPromptRouter);

// Roteamento para as subpastas de /gpt/v2/dados
import dadosAssistenteRouter from './dados/assistente/index.js';
import dadosPromptRouter from './dados/prompt/index.js';
router.use('/dados/assistant', dadosAssistenteRouter);
router.use('/dados/prompt', dadosPromptRouter);

// Roteamento para as subpastas de /gpt/v2/global
import globalAssistenteRouter from './global/assistente/index.js';
import globalPromptRouter from './global/prompt/index.js';
router.use('/global/assistant', globalAssistenteRouter);
router.use('/global/prompt', globalPromptRouter);

// Roteamento para as subpastas de /gpt/v2/preagendamento
import preagendamentoAssistenteRouter from './preagendamento/assistente/index.js';
import preagendamentoPromptRouter from './preagendamento/prompt/index.js';
router.use('/preagendamento/assistant', preagendamentoAssistenteRouter);
router.use('/preagendamento/prompt', preagendamentoPromptRouter);

// Roteamento para as subpastas de /gpt/v2/qualificado
import qualificadoAssistenteRouter from './qualificado/assistente/index.js';
import qualificadoPromptRouter from './qualificado/prompt/index.js';
router.use('/qualificado/assistant', qualificadoAssistenteRouter);
router.use('/qualificado/prompt', qualificadoPromptRouter);

// Roteamento para as subpastas de /gpt/v2/recepcao
import recepcaoAssistenteRouter from './recepcao/assistente/index.js';
import recepcaoPromptRouter from './recepcao/prompt/index.js';
router.use('/recepcao/assistant', recepcaoAssistenteRouter);
router.use('/recepcao/prompt', recepcaoPromptRouter);

// Roteamento para as subpastas de /gpt/v2/reaquecimento
import reaquecimentoAssistenteRouter from './reaquecimento/assistente/index.js';
import reaquecimentoPromptRouter from './reaquecimento/prompt/index.js';
router.use('/reaquecimento/assistant', reaquecimentoAssistenteRouter);
router.use('/reaquecimento/prompt', reaquecimentoPromptRouter);

// Roteamento para as subpastas de /gpt/v2/agendamento
import agendamentoAssistenteRouter from './agendamento/assistente/index.js';
import agendamentoPromptRouter from './agendamento/prompt/index.js';
router.use('/agendamento/assistant', agendamentoAssistenteRouter);
router.use('/agendamento/prompt', agendamentoPromptRouter);

export default router;