import express from 'express';

import Global from '../../../../../controllers/assistant-prompt/Global.js';
import kommoMiddleware from '../../../../../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(kommoMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - global' });
});

// ROTA GLOBAL
router.post('/:assistant_id', Global.assistant);

export default router;