import express from 'express';
import OpenAIController from '../controllers/OpenAIController.js';
import kommoMiddleware from '../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(kommoMiddleware);

router.get('/', OpenAIController.index);

// Rota para executar assistente (opcionalmente com ID de assistente) de agendamento concluido
router.post('/runAssistant/:assistant_id?/scheduled', OpenAIController.runAssistantScheduled);

// Rota para executar assistente (opcionalmente com ID de assistente) geral
router.post('/runAssistant/:assistant_id?', OpenAIController.runAssistant);

export default router;
