import express from 'express';
import WebhookMiddleware from '../middlewares/WebhookMiddleware.js';
import KommoWebhookController from '../controllers/KommoWebhookController.js';

const router = express.Router();
const webhookController = new KommoWebhookController();

router.use(express.urlencoded({ extended: true }));

router.post('/create', WebhookMiddleware.createLead, webhookController.created);

router.post('/message-received', WebhookMiddleware.messageReceived, webhookController.messageReceived);

export default router;