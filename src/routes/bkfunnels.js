import express from 'express';
import BkFunnelsController from '../controllers/BkFunnelsController.js';
import styled from '../utils/log/styled.js';
const router = express.Router();

router.use(express.json());

router.use((req, res, next) => {
  styled.middleware('Body received');
  styled.middlewaredir(req.body);
  next();
});

router.post('/webhook', BkFunnelsController.webhook);

router.post('/register', BkFunnelsController.registerUpdateLead);

export default router;