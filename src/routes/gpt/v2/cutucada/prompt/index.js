import express from 'express';

import CutucadaController from '../../../../../controllers/openaiIntegration/CutucadaController.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - cutucada' });
});

// BOT CUTUCADA
router.post('/intencao', CutucadaController.intencao);

router.post('/gerar-perguntas', CutucadaController.gerar_perguntas);

router.post('/gerar-pergunta-historico', CutucadaController.gerar_perguntas_historico);

export default router;