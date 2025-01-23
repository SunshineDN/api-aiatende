import express from 'express';

import ReaquecimentoController from '../../../../../controllers/openaiIntegration/ReaquecimentoController.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - reaquecimento' });
});

router.post('/intencao', ReaquecimentoController.intencao);

export default router;