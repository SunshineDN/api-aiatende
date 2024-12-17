const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const PosAgendamento = require('../../../../../controllers/assistant-prompt/PosAgendamento');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - pós agendamento' });
});

// BOT PÓS AGENDAMENTO
router.post('/intencao', PosAgendamento.intencao);

router.post('/intencao-falta', PosAgendamento.intencao_falta);

module.exports = router;
