import express from 'express';
import Recepcao from '../../../../../controllers/assistant-prompt/Recepcao.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - recepção' });
});

// BOT RECEPÇÃO
router.post('/:assistant_id/indefinido', Recepcao.indefinido);

router.post('/:assistant_id/nao-qualificado', Recepcao.nao_qualificado);

export default router;