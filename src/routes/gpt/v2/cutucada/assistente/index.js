const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const Cutucada = require('../../../../../controllers/assistant-prompt/Cutucada');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - cutucada' });
});

// BOT CUTUCADA
router.post('/:assistant_id/gerar-perguntas', Cutucada.gerar_perguntas);

router.post('/:assistant_id/assistente', Cutucada.assistente);

module.exports = router;
