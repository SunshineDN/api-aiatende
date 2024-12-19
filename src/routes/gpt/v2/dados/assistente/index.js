import express from 'express';
import bodyParser from 'body-parser';
import Dados from '../../../../../controllers/assistant-prompt/Dados.js';
import { decodeKommoURI } from '../../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

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

export default router;