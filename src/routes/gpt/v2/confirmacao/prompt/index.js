import express from 'express';
import Confirmacao from '../../../../../controllers/assistant-prompt/Confirmacao.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - confirmação' });
});

// BOT CONFIRMAÇÃO
router.post('/intencao', Confirmacao.intencao);

router.post('/intencao-presenca', Confirmacao.intencao_presenca);

export default router;