import express from 'express';
import OpenAIWebController from '../controllers/OpenAIWebController.js';

const router = express.Router();

router.use(express.json());

router.get('/', OpenAIWebController.index);

// Rota para executar assistente (opcionalmente com ID de assistente) geral
router.post('/send-message/:assistant_id?', OpenAIWebController.send_message);

// Rota para criar assistente personalizado
router.post('/custom-ai', OpenAIWebController.customAI);

export default router;
