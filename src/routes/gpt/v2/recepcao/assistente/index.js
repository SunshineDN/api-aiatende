import express from 'express';
import RecepcaoController from '../../../../../controllers/openaiIntegration/RecepcaoController.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - recepção' });
});

// BOT RECEPÇÃO
router.post('/:assistant_id/indefinido', RecepcaoController.indefinido);

router.post('/:assistant_id/nao-qualificado', RecepcaoController.nao_qualificado);

export default router;