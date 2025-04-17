import express from 'express';
import WppController from '../controllers/WppController.js';

const router = express.Router();
const wppController = new WppController();

router.get('/wbhk', (req,res) => wppController.handleWabhookReceived(req, res));

router.post('/wbhk/duplicate', (req,res) => wppController.handleWebhookDuplicate(req, res));

router.post('/message-upsert', (req,res ) => wppController.handleMessageUpsert(req,res));

export default router;