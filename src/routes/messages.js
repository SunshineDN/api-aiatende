const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const GlobalAssistant = require('../gpt-req/GlobalAssistant');
const PromptC = require('../gpt-req/PromptC');
const AssistantC = require('../gpt-req/AssistantC');
const PromptD = require('../gpt-req/PromptD');
const AssistantD = require('../gpt-req/AssistantD');
const PromptE = require('../gpt-req/PromptE');
const AssistantE = require('../gpt-req/AssistantE');
const Recepcao = require('../gpt-req/Recepcao');
const Aquecimento = require('../gpt-req/Aquecimento');
const Cutucada = require('../gpt-req/Cutucada');
const EsteiraConfirm = require('../gpt-req/EsteiraConfirm');
const ClienteAntigoNovo = require('../gpt-req/ClienteAntigoNovo');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de mensagens' });
});

router.post('/assistant/:assistant_id/only_assistant', GlobalAssistant.only_assistant);

// BOT C

router.post('/prompt/c_intencao', PromptC.c_intencao);

router.post('/prompt/c_confirma_dados', PromptC.c_confirma_dados);

router.post('/assistant/:assistant_id/c_previa_dados', AssistantC.c_previa_dados);

router.post('/assistant/:assistant_id/c_dados_cadastrais', AssistantC.c_dados_cadastrais);

router.post('/assistant/:assistant_id/c_continue_dados_cadastrais', AssistantC.c_continue_dados_cadastrais);

router.post('/assistant/:assistant_id/c_split_dados', AssistantC.c_split_dados);

router.post('/assistant/:assistant_id/c_verifica_dados', AssistantC.c_verifica_dados);

// BOT D

router.post('/prompt/d_intencao', PromptD.d_intencao);

router.post('/prompt/d_verificar_confirmacao', PromptD.d_verificar_confirmacao);

router.post('/prompt/d_confirmar_data', PromptD.d_confirmar_data);

router.post('/assistant/:assistant_id/d_disponibilidade', AssistantD.d_disponibilidade);

router.post('/assistant/:assistant_id/d_previa_datas', AssistantD.d_previa_datas);

router.post('/assistant/:assistant_id/d_verificar_datas', AssistantD.d_verificar_datas);

router.post('/assistant/:assistant_id/d_confirmacao', AssistantD.d_confirmacao);

// BOT E

router.post('/prompt/e_identificar_confirmacao', PromptE.identificar_confirmacao);

router.post('/prompt/e_intencao_faltosos', PromptE.faltosos);

router.post('/assistant/:assistant_id/e_confirmacao_vinda', AssistantE.confirmacao_vinda);

router.post('/assistant/:assistant_id/e_reagendamento', AssistantE.reagendamento);

router.post('/assistant/:assistant_id/e_faltosos', AssistantE.faltosos);

// BOT RECEPÇÃO

router.post('/prompt/recepcao/intencao', Recepcao.intencao);

router.post('/assistant/:assistant_id/recepcao/indefinido', Recepcao.indefinido);

router.post('/assistant/:assistant_id/recepcao/nao_qualificado', Recepcao.nao_qualificado);

// BOT AQUECIMENTO

router.post('/assistant/:assistant_id/aquecimento/lead', Aquecimento.aquecimento);

router.post('/prompt/aquecimento/intencao', Aquecimento.intencao);

router.post('/assistant/:assistant_id/aquecimento/nao_qualificado', Aquecimento.nao_qualificado);

// BOT CLIENTE ANTIGO/NOVO

router.post('/prompt/cliente_an/prompt', ClienteAntigoNovo.intencao);

router.post('/assistant/:assistant_id/cliente_an/assistente', ClienteAntigoNovo.assistente);

// BOT CUTUCADA

router.post('/prompt/cutucada/intencao', Cutucada.intencao);

router.post('/prompt/cutucada/gerar_perguntas', Cutucada.gerar_perguntas);

router.post('/assistant/:assistant_id/cutucada/assistante', Cutucada.assistente);

// BOT PÓS-AGENDAMENTO - ESTEIRA DE CONFIRMAÇÕES

router.post('/prompt/confirmacao/intencao', EsteiraConfirm.intencao);

router.post('/assistant/:assistant_id/confirmacao/24h_1st_try', EsteiraConfirm._24h_1);

router.post('/assistant/:assistant_id/confirmacao/24h_2nd_try', EsteiraConfirm._24h_2);

router.post('/assistant/:assistant_id/confirmacao/24h_3rd_try', EsteiraConfirm._24h_3);

router.post('/assistant/:assistant_id/confirmacao/3h_1st_try', EsteiraConfirm._3h_1);

router.post('/assistant/:assistant_id/confirmacao/3h_2nd_try', EsteiraConfirm._3h_2);

module.exports = router;
