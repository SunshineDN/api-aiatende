const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const PreAgendamento = require('../../../../../controllers/assistant-prompt/PreAgendamento');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - pré agendamento' });
});

// BOT PRÉ AGENDAMENTO
router.post('/intencao', PreAgendamento.intencao);

router.post('/verificar-confirmacao', PreAgendamento.verificar_confirmacao);

router.post('/confirmar-data', PreAgendamento.confirmar_data);

router.post('/verificar-agenda-especialista', PreAgendamento.verificar_agenda_especialista);

module.exports = router;
