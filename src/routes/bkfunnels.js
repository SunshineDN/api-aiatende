import express from 'express';
import BkFunnelsController from '../controllers/BkFunnelsController.js';
const router = express.Router();

router.use(express.json());

router.post('/webhook', BkFunnelsController.webhook);

router.post('/register', BkFunnelsController.registerUpdateLead);

export default router;