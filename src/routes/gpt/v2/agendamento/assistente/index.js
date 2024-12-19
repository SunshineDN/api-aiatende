import express from 'express';
import bodyParser from 'body-parser';
import Agendamento from '../../../../../controllers/assistant-prompt/Agendamento.js';
import { decodeKommoURI } from '../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - agendamento' });
});

// BOT AGENDAMENTO
router.post('/:assistant_id/form-join', Agendamento.form_join);

router.post('/:assistant_id/disponibilidade-horario', Agendamento.disponibilidade_horario);

router.post('/:assistant_id/verificar-datas', Agendamento.verificar_datas);

export default router;