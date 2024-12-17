const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const Qualificado = require('../../../../../controllers/assistant-prompt/Qualificado');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - qualificado' });
});

// BOT QUALIFICADO
router.post('/intencao', Qualificado.intencao);

module.exports = router;
