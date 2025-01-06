import express from 'express';
import PosAgendamento from '../../../../../controllers/assistant-prompt/PosAgendamento.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - pós agendamento' });
});

// BOT PÓS AGENDAMENTO
router.post('/intencao', PosAgendamento.intencao);

router.post('/intencao-falta', PosAgendamento.intencao_falta);

export default router;