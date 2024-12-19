import express from 'express';
import bodyParser from 'body-parser';
import Dados from '../../../../../controllers/assistant-prompt/Dados.js';
import { decodeKommoURI } from '../../../../../middlewares/decodeKommoURI.js';

const router = express.Router();

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

export default router;