const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const Recepcao = require('../../../../../controllers/assistant-prompt/Recepcao');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - recepção' });
});

// BOT RECEPÇÃO
router.post('/intencao', Recepcao.intencao);

module.exports = router;
