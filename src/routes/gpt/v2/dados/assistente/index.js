import express from 'express';

import Dados from '../../../../../controllers/assistant-prompt/Dados.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

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