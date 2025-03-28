import express from 'express';
import WppController from '../controllers/WppController.js';

const router = express.Router();

router.get('/wbhk', WppController.handleWabhookReceived);

router.post('/message-upsert', WppController.handleMessageUpsert);

export default router;