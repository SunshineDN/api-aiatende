import express from 'express';
import ConfirmacaoController from '../../../../../controllers/openaiIntegration/ConfirmacaoController.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - confirmação' });
});

// BOT CONFIRMAÇÃO
router.post('/:assistant_id/confirmar-presenca', ConfirmacaoController.confirmar_presenca);

router.post('/:assistant_id/24h-1st-try', ConfirmacaoController.primeiro_contato_24h);

router.post('/:assistant_id/24h-2nd-try', ConfirmacaoController.segundo_contato_24h);

router.post('/:assistant_id/24h-3rd-try', ConfirmacaoController.terceiro_contato_24h);

router.post('/:assistant_id/3h-1st-try', ConfirmacaoController.primeiro_contato_3h);

router.post('/:assistant_id/3h-2nd-try', ConfirmacaoController.segundo_contato_3h);

export default router;