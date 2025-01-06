import express from 'express';
import Agendamento from '../../../../../controllers/assistant-prompt/Agendamento.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - agendamento' });
});

// BOT AGENDAMENTO
router.post('/:assistant_id/form-join', Agendamento.form_join);

router.post('/:assistant_id/disponibilidade-horario', Agendamento.disponibilidade_horario);

router.post('/:assistant_id/verificar-datas', Agendamento.verificar_datas);

export default router;