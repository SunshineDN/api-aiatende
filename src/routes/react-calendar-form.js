import express from 'express';
import styled from '../utils/log/styled.js';
import CalendarController from '../controllers/CalendarController.js';
import WebCalendarController from '../controllers/WebCalendarController.js';

const router = express.Router();

router.use(express.json({ type: 'application/json' }));

router.use((req, _, next) => {
  styled.middleware('Request Type: ', req.method);
  styled.middleware('Request URL: ', req.originalUrl);
  styled.middleware('Request Body:');
  styled.middlewaredir(req.body);
  next();
});

router.get('/', CalendarController.index);

router.post('/initial', WebCalendarController.initial);

router.post('/choice', WebCalendarController.choice);

router.post('/register', WebCalendarController.register);

export default router;