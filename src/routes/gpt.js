import express from 'express';
import GptController from '../controllers/GptController.js';
import kommoMiddleware from '../middlewares/kommoMiddleware.js';
import messageReceivedMiddleware from '../middlewares/messageReceivedMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get('/', kommoMiddleware, GptController.index);

router.post('/prompt', kommoMiddleware, GptController.messageToPrompt);

router.post('/:assistant_id/message', kommoMiddleware, GptController.messageToAssistant);

router.post('/transcribe', messageReceivedMiddleware, GptController.transcribeMessage);

router.post('/delete-thread', kommoMiddleware, GptController.deleteThread);

router.post('/audio-to-text', kommoMiddleware, GptController.transcribeMessage);

router.post('/text-to-audio', kommoMiddleware, GptController.sendAudioFromGpt);

export default router;
