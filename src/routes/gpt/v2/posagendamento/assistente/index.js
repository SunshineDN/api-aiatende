import express from 'express';
import PosAgendamento from '../../../../../controllers/assistant-prompt/PosAgendamento.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - pós agendamento' });
});

// BOT PÓS AGENDAMENTO
router.post('/:assistant_id/confirmar-presenca', PosAgendamento.confirmar_presenca);

router.post('/:assistant_id/notificar-falta', PosAgendamento.notificar_falta);

router.post('/:assistant_id/iniciar-reagendamento', PosAgendamento.inicar_reagendamento);

export default router;