import express from 'express';
import bodyParser from 'body-parser';
import Recepcao from '../../../../../controllers/assistant-prompt/Recepcao.js';
import { decodeKommoURI } from '../../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - recepção' });
});

// BOT RECEPÇÃO
router.post('/:assistant_id/indefinido', Recepcao.indefinido);

router.post('/:assistant_id/nao-qualificado', Recepcao.nao_qualificado);

export default router;