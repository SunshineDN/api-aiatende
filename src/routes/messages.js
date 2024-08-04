const express = require('express');
const router = express.Router();
const Prompt = require('../gpt-req/Prompt');
const decodeKommoURI = require('../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const Assistant = require('../gpt-req/Assistant');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de mensagens' });
});

router.post('/prompt/c_intencao', Prompt.c_intencao);

router.post('/assistant/:assistant_id/c_previa_dados', Assistant.c_previa_dados);

router.post('/assistant/:assistant_id/c_dados_cadastrais', Assistant.c_dados_cadastrais);

module.exports = router;
