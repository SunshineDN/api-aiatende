const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const Recepcao = require('../../../../controllers/assistant-prompt/Recepcao');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/recepcao/assistente', (req, res) => {
  res.json({ message: 'Rota de mensagens' });
});

// BOT RECEPÇÃO

router.post('/assistant/:assistant_id/recepcao/indefinido', Recepcao.indefinido);

router.post('/assistant/:assistant_id/recepcao/nao_qualificado', Recepcao.nao_qualificado);

module.exports = router;
