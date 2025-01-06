import express from 'express';

import Dados from '../../../../../controllers/assistant-prompt/Dados.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de prompt - dados' });
});

// BOT DADOS
router.post('/intencao', Dados.intencao);

router.post('/confirma-dados', Dados.confirma_dados);

router.post('/intencao-especialista', Dados.intencao_especialista);

router.post('/identificar-especialista', Dados.identificar_especialista);

export default router;