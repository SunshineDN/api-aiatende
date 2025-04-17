import express from 'express';

import CutucadaController from '../../../../../controllers/openaiIntegration/CutucadaController.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - cutucada' });
});

// BOT CUTUCADA
router.post('/:assistant_id/assistente', CutucadaController.assistente);

export default router;