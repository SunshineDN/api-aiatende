import express from 'express';

import Recepcao from '../../../../../controllers/assistant-prompt/Recepcao.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - recepção' });
});

// BOT RECEPÇÃO
router.post('/intencao', Recepcao.intencao);

export default router;