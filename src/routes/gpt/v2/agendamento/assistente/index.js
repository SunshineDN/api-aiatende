import express from 'express';
import AgendamentoController from '../../../../../controllers/openaiIntegration/AgendamentoController.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - agendamento' });
});

// BOT RECEPÇÃO
router.post('/:assistant_id/form', AgendamentoController.form);

router.post('/:assistant_id/calendar', AgendamentoController.calendar);

export default router;