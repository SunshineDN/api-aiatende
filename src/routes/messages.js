const express = require('express');
const router = express.Router();
const Prompt = require('../gpt-req/Prompt');
const decodeKommoURI = require('../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de mensagens' });
});

router.post('/prompt/c_intencao', Prompt.c_intencao);

module.exports = router;
