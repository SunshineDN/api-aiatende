import express from 'express';

import Cutucada from '../../../../../controllers/assistant-prompt/Cutucada.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - cutucada' });
});

// BOT CUTUCADA
router.post('/:assistant_id/assistente', Cutucada.assistente);

export default router;