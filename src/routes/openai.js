import express from 'express';
import OpenAIController from '../controllers/OpenAIController.js';
import kommoMiddleware from '../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(kommoMiddleware);

router.get('/', OpenAIController.index);

router.post('/runAssistant/:assistant_id?', OpenAIController.runAssistant);

router.post('/runAssistant/:assistant_id?/scheduled', OpenAIController.runAssistantScheduled);

export default router;
