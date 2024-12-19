import express from 'express';
import bodyParser from 'body-parser';
import Global from '../../../../../controllers/assistant-prompt/Global.js';
import { decodeKommoURI } from '../../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - global' });
});

// ROTA GLOBAL
router.post('/:assistant_id', Global.assistant);

export default router;