import express from 'express';
import styled from '../utils/log/styledLog.js';
import CalendarController from '../controllers/CalendarController.js';
import { DecryptId } from '../utils/crypt/DecryptId.js';

const router = express.Router();

router.use(express.json({ type: 'application/json' }));

router.use((req, res, next) => {
  styled.middleware('Request Type: ', req.method);
  styled.middleware('Request URL: ', req.originalUrl);
  req.body.lead_id = DecryptId(req.body.lead_id);
  styled.middlewaredir('Request Body: ', req.body);
  next();
});

router.get('/', CalendarController.index);

router.post('/listEvents', CalendarController.listEventsWeb);

export default router;