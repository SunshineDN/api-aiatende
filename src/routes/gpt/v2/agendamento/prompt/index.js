const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const Agendamento = require('../../../../../controllers/assistant-prompt/Agendamento');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - confirmação' });
});

// BOT CONFIRMAÇÃO
router.post('/intencao', Agendamento.intencao);

router.post('/verificar-confirmacao', Agendamento.verificar_confirmacao);

module.exports = router;
