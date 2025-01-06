import express from 'express';
import styled from '../utils/log/styledLog.js';
import CalendarController from '../controllers/CalendarController.js';
import WebCalendarController from '../controllers/WebCalendarController.js';

const router = express.Router();

router.use(express.json({ type: 'application/json' }));

router.use((req, _, next) => {
  styled.middleware('Request Type: ', req.method);
  styled.middleware('Request URL: ', req.originalUrl);
  styled.middlewaredir('Request Body: ', req.body);
  next();
});

router.get('/', CalendarController.index);

router.post('/listEvents', CalendarController.listEventsWeb);

router.post('/initial', WebCalendarController.initial);

router.post('/default', WebCalendarController.default);

router.post('/choice', WebCalendarController.choice);

router.post('/register', WebCalendarController.register);

export default router;