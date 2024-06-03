const express = require('express');
const router = express.Router();
const GptController = require('../controllers/GptController');
const decodeKommoURI = require('../middlewares/decodeKommoURI');

router.use(decodeKommoURI);

router.post('/', GptController.index);

router.post('/prompt', GptController.messageToPrompt);

router.post('/:assistant_id/message', GptController.messageToAssistant);

router.post('/message', GptController.transcribeMessage);

router.post('/audio-to-text', GptController.transcribeMessage);

router.post('/text-to-audio', GptController.sendAudioFromGpt);

module.exports = router;
