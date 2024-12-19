import express from 'express';
import bodyParser from 'body-parser';
import PreAgendamento from '../../../../../controllers/assistant-prompt/PreAgendamento.js';
import { decodeKommoURI } from '../../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - pré agendamento' });
});

// BOT PRÉ AGENDAMENTO
router.post('/intencao', PreAgendamento.intencao);

router.post('/verificar-confirmacao', PreAgendamento.verificar_confirmacao);

router.post('/confirmar-data', PreAgendamento.confirmar_data);

router.post('/verificar-agenda-especialista', PreAgendamento.verificar_agenda_especialista);

export default router;