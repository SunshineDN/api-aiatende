import express from 'express';
import bodyParser from 'body-parser';
import Cutucada from '../../../../../controllers/assistant-prompt/Cutucada.js';
import { decodeKommoURI } from '../../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - cutucada' });
});

// BOT CUTUCADA
router.post('/:assistant_id/gerar-perguntas', Cutucada.gerar_perguntas);

router.post('/:assistant_id/assistente', Cutucada.assistente);

export default router;