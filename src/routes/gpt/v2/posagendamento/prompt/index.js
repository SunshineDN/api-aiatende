import express from 'express';
import bodyParser from 'body-parser';
import PosAgendamento from '../../../../../controllers/assistant-prompt/PosAgendamento.js';
import { decodeKommoURI } from '../../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - pós agendamento' });
});

// BOT PÓS AGENDAMENTO
router.post('/intencao', PosAgendamento.intencao);

router.post('/intencao-falta', PosAgendamento.intencao_falta);

export default router;