const express = require('express');
const router = express.Router();

// Roteamento para as subpastas de /gpt/v2/confirmacao
const confirmacaoAssistenteRouter = require('./confirmacao/assistente');
const confirmacaoPromptRouter = require('./confirmacao/prompt');
router.use('/confirmacao/assistant', confirmacaoAssistenteRouter);
router.use('/confirmacao/prompt', confirmacaoPromptRouter);

// Roteamento para as subpastas de /gpt/v2/cutucada
const cutucadaAssistenteRouter = require('./cutucada/assistente');
const cutucadaPromptRouter = require('./cutucada/prompt');
router.use('/cutucada/assistant', cutucadaAssistenteRouter);
router.use('/cutucada/prompt', cutucadaPromptRouter);

// Roteamento para as subpastas de /gpt/v2/dados
const dadosAssistenteRouter = require('./dados/assistente');
const dadosPromptRouter = require('./dados/prompt');
router.use('/dados/assistant', dadosAssistenteRouter);
router.use('/dados/prompt', dadosPromptRouter);

// Roteamento para as subpastas de /gpt/v2/global
const globalAssistenteRouter = require('./global/assistente');
const globalPromptRouter = require('./global/prompt');
router.use('/global/assistant', globalAssistenteRouter);
router.use('/global/prompt', globalPromptRouter);

// Roteamento para as subpastas de /gpt/v2/posagendamento
const posagendamentoAssistenteRouter = require('./posagendamento/assistente');
const posagendamentoPromptRouter = require('./posagendamento/prompt');
router.use('/posagendamento/assistant', posagendamentoAssistenteRouter);
router.use('/posagendamento/prompt', posagendamentoPromptRouter);

// Roteamento para as subpastas de /gpt/v2/preagendamento
const preagendamentoAssistenteRouter = require('./preagendamento/assistente');
const preagendamentoPromptRouter = require('./preagendamento/prompt');
router.use('/preagendamento/assistant', preagendamentoAssistenteRouter);
router.use('/preagendamento/prompt', preagendamentoPromptRouter);

// Roteamento para as subpastas de /gpt/v2/qualificado
const qualificadoAssistenteRouter = require('./qualificado/assistente');
const qualificadoPromptRouter = require('./qualificado/prompt');
router.use('/qualificado/assistant', qualificadoAssistenteRouter);
router.use('/qualificado/prompt', qualificadoPromptRouter);

// Roteamento para as subpastas de /gpt/v2/recepcao
const recepcaoAssistenteRouter = require('./recepcao/assistente');
const recepcaoPromptRouter = require('./recepcao/prompt');
router.use('/recepcao/assistant', recepcaoAssistenteRouter);
router.use('/recepcao/prompt', recepcaoPromptRouter);

module.exports = router;
