import express from 'express';
import bodyParser from 'body-parser';
import Cutucada from '../../../../../controllers/assistant-prompt/Cutucada.js';
import { decodeKommoURI } from '../../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - cutucada' });
});

// BOT CUTUCADA
router.post('/intencao', Cutucada.intencao);

export default router;