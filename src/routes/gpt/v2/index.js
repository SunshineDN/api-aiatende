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


// Roteamento para as subpastas de /gpt/v2/global
import globalAssistenteRouter from './global/assistente/index.js';
import globalPromptRouter from './global/prompt/index.js';
router.use('/global/assistant', globalAssistenteRouter);
router.use('/global/prompt', globalPromptRouter);

// Roteamento para as subpastas de /gpt/v2/posagendamento
import posagendamentoAssistenteRouter from './posagendamento/assistente/index.js';
import posagendamentoPromptRouter from './posagendamento/prompt/index.js';
router.use('/posagendamento/assistant', posagendamentoAssistenteRouter);
router.use('/posagendamento/prompt', posagendamentoPromptRouter);


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

export default router;