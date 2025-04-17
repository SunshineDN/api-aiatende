import express from 'express';
import QualificadoController from '../../../../../controllers/openaiIntegration/QualificadoController.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - qualificado' });
});

// BOT QUALIFICADO
router.post('/intencao', QualificadoController.intencao);

export default router;