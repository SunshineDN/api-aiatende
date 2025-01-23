import express from 'express';

import PreAgendamento from '../../../../../controllers/assistant-prompt/PreAgendamento.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - pré agendamento' });
});

// BOT PRÉ AGENDAMENTO
router.post('/intencao', PreAgendamento.intencao);

router.post('/verificar-confirmacao', PreAgendamento.verificar_confirmacao);

router.post('/confirmar-data', PreAgendamento.confirmar_data);

router.post('/verificar-agenda-especialista', PreAgendamento.verificar_agenda_especialista);

export default router;