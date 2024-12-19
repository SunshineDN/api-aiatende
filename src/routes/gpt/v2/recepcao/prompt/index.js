import express from 'express';
import bodyParser from 'body-parser';
import Recepcao from '../../../../../controllers/assistant-prompt/Recepcao.js';
import { decodeKommoURI } from '../../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - recepção' });
});

// BOT RECEPÇÃO
router.post('/intencao', Recepcao.intencao);

export default router;