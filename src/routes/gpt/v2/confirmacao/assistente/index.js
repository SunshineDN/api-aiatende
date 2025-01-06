import express from 'express';
import Confirmacao from '../../../../../controllers/assistant-prompt/Confirmacao.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - confirmação' });
});

// BOT CONFIRMAÇÃO
router.post('/:assistant_id/24h-1st-try', Confirmacao._24h_1);

router.post('/:assistant_id/24h-2nd-try', Confirmacao._24h_2);

router.post('/:assistant_id/24h-3rd-try', Confirmacao._24h_3);

router.post('/:assistant_id/3h-1st-try', Confirmacao._3h_1);

router.post('/:assistant_id/3h-2nd-try', Confirmacao._3h_2);

export default router;