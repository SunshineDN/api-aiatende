import express from 'express';
import FunnelBuilderController from '../controllers/FunnelBuilderController.js';
import styled from '../utils/log/styled.js';
const router = express.Router();

router.use(express.json());

router.use((req, res, next) => {
  styled.middleware('Body received');
  styled.middlewaredir(req.body);
  next();
});

router.post('/webhook', FunnelBuilderController.webhook);

router.post('/funnel', FunnelBuilderController.handleWebhook);

export default router;