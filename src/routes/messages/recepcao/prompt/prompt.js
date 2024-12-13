const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/recepcao/prompt', (req, res) => {
  res.json({ message: 'Rota de mensagens' });
});

// BOT RECEPÇÃO

module.exports = router;
