import express from 'express';

import GlobalController from '../../../../../controllers/openaiIntegration/GlobalController.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - global' });
});

// ROTA GLOBAL
router.post('/', GlobalController.prompt);

export default router;