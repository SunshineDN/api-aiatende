const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const Agendamento = require('../../../../../controllers/assistant-prompt/Agendamento');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - agendamento' });
});

// BOT AGENDAMENTO
router.post('/:assistant_id/form-join', Agendamento.form_join);

router.post('/:assistant_id/disponibilidade-horario', Agendamento.disponibilidade_horario);

router.post('/:assistant_id/verificar-datas', Agendamento.verificar_datas);

module.exports = router;
