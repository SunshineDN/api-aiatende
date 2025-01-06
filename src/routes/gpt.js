import express from 'express';
import GptController from '../controllers/GptController.js';
import kommoMiddleware from '../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(kommoMiddleware);

router.get('/', GptController.index);

router.post('/prompt', GptController.messageToPrompt);

router.post('/:assistant_id/message', GptController.messageToAssistant);

router.post('/transcribe', GptController.transcribeMessage);

router.post('/delete-thread', GptController.deleteThread);

router.post('/audio-to-text', GptController.transcribeMessage);

router.post('/text-to-audio', GptController.sendAudioFromGpt);

export default router;
