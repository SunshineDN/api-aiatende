import express from 'express';
import bodyParser from 'body-parser';
import PreAgendamento from '../../../../../controllers/assistant-prompt/PreAgendamento.js';
import { decodeKommoURI } from '../../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - pré agendamento' });
});

// BOT PRÉ AGENDAMENTO
router.post('/:assistant_id/disponibilidade', PreAgendamento.disponibilidade);

router.post('/:assistant_id/verificar-datas', PreAgendamento.verificar_datas);

router.post('/:assistant_id/confirmacao', PreAgendamento.confirmacao);

export default router;