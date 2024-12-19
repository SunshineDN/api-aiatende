import express from 'express';
import bodyParser from 'body-parser';
import Agendamento from '../../../../../controllers/assistant-prompt/Agendamento.js';
import { decodeKommoURI } from '../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - confirmação' });
});

// BOT CONFIRMAÇÃO
router.post('/intencao', Agendamento.intencao);

router.post('/verificar-confirmacao', Agendamento.verificar_confirmacao);

export default router;