const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const Dados = require('../../../../../controllers/assistant-prompt/Dados');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - dados' });
});

// BOT DADOS
router.post('/:assistant_id/previa-dados', Dados.previa_dados);

router.post('/:assistant_id/dados-cadastrais', Dados.dados_cadastrais);

router.post('/:assistant_id/split-dados', Dados.split_dados);

router.post('/:assistant_id/verifica-dados', Dados.verifica_dados);

router.post('/:assistant_id/listar-especialidades', Dados.listar_especialidades);

router.post('/:assistant_id/verificar-especialista', Dados.verificar_especialista);

module.exports = router;
