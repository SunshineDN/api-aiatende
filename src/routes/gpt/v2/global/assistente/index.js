const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const Recepcao = require('../../../../../controllers/assistant-prompt/Recepcao');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - recepção' });
});

// BOT RECEPÇÃO
router.post('/:assistant_id/indefinido', Recepcao.indefinido);

router.post('/:assistant_id/nao_qualificado', Recepcao.nao_qualificado);

module.exports = router;
