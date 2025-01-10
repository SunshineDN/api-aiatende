import express from 'express';
import WebhookMiddlewares from '../middlewares/WebhookMiddlewares.js';
import LeadController from '../controllers/LeadController';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

const leadController = new LeadController();

router.post('/create', WebhookMiddlewares.createLead, leadController.webhookCreate);

router.post('/message-received', WebhookMiddlewares.messageReceived, )


