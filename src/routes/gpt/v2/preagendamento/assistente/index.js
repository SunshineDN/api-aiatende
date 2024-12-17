const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const PreAgendamento = require('../../../../../controllers/assistant-prompt/PreAgendamento');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - pré agendamento' });
});

// BOT PRÉ AGENDAMENTO
router.post('/:assistant_id/disponibilidade', PreAgendamento.disponibilidade);

router.post('/:assistant_id/verificar-datas', PreAgendamento.verificar_datas);

router.post('/:assistant_id/confirmacao', PreAgendamento.confirmacao);

module.exports = router;
