import express from 'express';
import bodyParser from 'body-parser';
import Qualificado from '../../../../../controllers/assistant-prompt/Qualificado.js';
import { decodeKommoURI } from '../../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - qualificado' });
});

// BOT QUALIFICADO
router.post('/:assistant_id/qualificado', Qualificado.qualificado);

router.post('/:assistant_id/nao-qualificado', Qualificado.nao_qualificado);

export default router;