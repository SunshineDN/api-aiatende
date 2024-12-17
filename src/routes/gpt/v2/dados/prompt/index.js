const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const Dados = require('../../../../../controllers/assistant-prompt/Dados');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - dados' });
});

// BOT DADOS
router.post('/intencao', Dados.intencao);

router.post('/confirma-dados', Dados.confirma_dados);

router.post('/intencao-especialista', Dados.intencao_especialista);

router.post('/identificar-especialista', Dados.identificar_especialista);

module.exports = router;
