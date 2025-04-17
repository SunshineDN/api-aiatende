import express from 'express';

import GlobalController from '../../../../../controllers/openaiIntegration/GlobalController.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - global' });
});

// ROTA GLOBAL
router.post('/:assistant_id', GlobalController.assistente);

export default router;