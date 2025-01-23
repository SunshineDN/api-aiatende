import express from 'express';
import GlobalAssistant from '../gpt-req/GlobalAssistant.js';
import PromptD from '../gpt-req/PromptD.js';
import AssistantD from '../gpt-req/AssistantD.js';
import Cutucada from '../gpt-req/Cutucada.js';
import EsteiraConfirm from '../gpt-req/EsteiraConfirm.js';
import Repescagem from '../gpt-req/Repescagem.js';
import AgendamentoVoz from '../gpt-req/AgendamentoVoz.js';
import Dados from '../controllers/assistant-prompt/Dados.js';
import PostScheduling from '../controllers/assistant-prompt/PosAgendamento.js';
import Agendamento from '../controllers/assistant-prompt/Agendamento.js';
import Recepcao from '../controllers/assistant-prompt/Recepcao.js';
import Qualificado from '../controllers/assistant-prompt/Qualificado.js';
import kommoMiddleware from '../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de mensagens' });
});

router.post('/assistant/:assistant_id/only_assistant', GlobalAssistant.only_assistant);

// BOT C: DADOS

router.post('/prompt/dados/intencao', Dados.intencao);

router.post('/prompt/dados/confirma_dados', Dados.confirma_dados);

router.post('/prompt/dados/intencao_especialista', Dados.intencao_especialista);

router.post('/prompt/dados/identificar_especialista', Dados.identificar_especialista);

router.post('/assistant/:assistant_id/dados/previa_dados', Dados.previa_dados);

router.post('/assistant/:assistant_id/dados/dados_cadastrais', Dados.dados_cadastrais);

router.post('/assistant/:assistant_id/dados/split_dados', Dados.split_dados);

router.post('/assistant/:assistant_id/dados/verifica_dados', Dados.verifica_dados);

router.post('/assistant/:assistant_id/dados/listar_especialidades', Dados.listar_especialidades);

router.post('/assistant/:assistant_id/dados/verificar_especialista', Dados.verificar_especialista);

// BOT PRÉ-AGENDAMENTO

router.post('/prompt/d_intencao', PromptD.d_intencao);

router.post('/prompt/d_verificar_confirmacao', PromptD.d_verificar_confirmacao);

router.post('/prompt/d_confirmar_data', PromptD.d_confirmar_data);

router.post('/prompt/d_verificar_agenda_especialista', PromptD.d_verificar_agenda_especialista);

router.post('/assistant/:assistant_id/d_disponibilidade', AssistantD.d_disponibilidade);

router.post('/assistant/:assistant_id/d_previa_datas', AssistantD.d_previa_datas);

router.post('/assistant/:assistant_id/d_verificar_datas', AssistantD.d_verificar_datas);

router.post('/assistant/:assistant_id/d_confirmacao', AssistantD.d_confirmacao);

// BOT PÓS AGENDAMENTO

router.post('/prompt/post-scheduling/analyze-intent', PostScheduling.analyzeIntent);

router.post('/prompt/post-scheduling/interpret-no-show', PostScheduling.interpretNoShowResponse);

router.post('/assistant/:assistant_id/post-scheduling/confirm-attendance', PostScheduling.confirmAttendance);

router.post('/assistant/:assistant_id/post-scheduling/initial-rescheduling', PostScheduling.initiateRescheduling);

router.post('/assistant/:assistant_id/post-scheduling/notify-no-show', PostScheduling.notifyNoShow);

// BOT AGENDAMENTO

router.post('/assistant/:assistant_id/agendamento/form_join', Agendamento.form_join);

router.post('/assistant/:assistant_id/agendamento/disponibilidade', Agendamento.disponibilidade_horario);

router.post('/prompt/agendamento/intencao', Agendamento.intencao);

router.post('/assistant/:assistant_id/agendamento/verificar_datas', Agendamento.verificar_datas);

router.post('/prompt/agendamento/verificar_confirmacao', Agendamento.verificar_confirmacao);

// BOT RECEPÇÃO

router.post('/prompt/recepcao/intencao', Recepcao.intencao);

router.post('/assistant/:assistant_id/recepcao/indefinido', Recepcao.indefinido);

router.post('/assistant/:assistant_id/recepcao/nao_qualificado', Recepcao.nao_qualificado);

// BOT QUALIFICADO

router.post('/assistant/:assistant_id/qualificado/lead', Qualificado.qualificado);

router.post('/prompt/qualificado/intencao', Qualificado.intencao);

router.post('/assistant/:assistant_id/qualificado/nao_qualificado', Qualificado.nao_qualificado);

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

// BOT REPESCAGEM

router.post('/prompt/repescagem/intencao', Repescagem.intencao);

router.post('/assistant/:assistant_id/repescagem/frio', Repescagem.frio);

router.post('/assistant/:assistant_id/repescagem/congelado', Repescagem.congelado);

// AGENDAMENTO POR VOZ

router.post('/assistant/:assistant_id/agendamento/voz', AgendamentoVoz.voice_schedule);

export default router;