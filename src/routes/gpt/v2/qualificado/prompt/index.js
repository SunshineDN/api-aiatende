import express from 'express';
import bodyParser from 'body-parser';
import Qualificado from '../../../../../controllers/assistant-prompt/Qualificado.js';
import { decodeKommoURI } from '../../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - qualificado' });
});

// BOT QUALIFICADO
router.post('/intencao', Qualificado.intencao);

export default router;