import express from 'express';

import Qualificado from '../../../../../controllers/assistant-prompt/Qualificado.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - qualificado' });
});

// BOT QUALIFICADO
router.post('/intencao', Qualificado.intencao);

export default router;