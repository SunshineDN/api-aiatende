import express from 'express';
import bodyParser from 'body-parser';
import GptController from '../controllers/GptController.js';
import { decodeKommoURI } from '../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', GptController.index);

router.post('/prompt', GptController.messageToPrompt);

router.post('/:assistant_id/message', GptController.messageToAssistant);

router.post('/transcribe', GptController.transcribeMessage);

router.post('/delete-thread', GptController.deleteThread);

router.post('/audio-to-text', GptController.transcribeMessage);

router.post('/text-to-audio', GptController.sendAudioFromGpt);

export default router;
