import express from 'express';
import ReaquecimentoController from '../../../../../controllers/openaiIntegration/ReaquecimentoController.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - reaquecimento' });
});

// BOT RECEPÇÃO
router.post('/:assistant_id/frio', ReaquecimentoController.frio);

router.post('/:assistant_id/congelado', ReaquecimentoController.congelado);

export default router;