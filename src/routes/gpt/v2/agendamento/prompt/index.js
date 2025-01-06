import express from 'express';

import Agendamento from '../../../../../controllers/assistant-prompt/Agendamento.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - confirmação' });
});

// BOT CONFIRMAÇÃO
router.post('/intencao', Agendamento.intencao);

router.post('/verificar-confirmacao', Agendamento.verificar_confirmacao);

export default router;