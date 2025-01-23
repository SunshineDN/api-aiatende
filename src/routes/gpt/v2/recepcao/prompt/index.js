import express from 'express';

import RecepcaoController from '../../../../../controllers/openaiIntegration/RecepcaoController.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - recepção' });
});

// BOT RECEPÇÃO
router.post('/intencao', RecepcaoController.intencao);

export default router;