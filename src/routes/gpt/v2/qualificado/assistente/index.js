const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const Qualificado = require('../../../../../controllers/assistant-prompt/Qualificado');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - qualificado' });
});

// BOT QUALIFICADO
router.post('/:assistant_id/qualificado', Qualificado.qualificado);

router.post('/:assistant_id/nao-qualificado', Qualificado.nao_qualificado);

module.exports = router;
