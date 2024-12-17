const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const Confirmacao = require('../../../../../controllers/assistant-prompt/Confirmacao');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - confirmação' });
});

// BOT CONFIRMAÇÃO
router.post('/intencao', Confirmacao.intencao);

module.exports = router;
