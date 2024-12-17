const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const Cutucada = require('../../../../../controllers/assistant-prompt/Cutucada');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - cutucada' });
});

// BOT CUTUCADA
router.post('/intencao', Cutucada.intencao);

module.exports = router;
