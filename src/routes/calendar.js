import express from 'express';
import CalendarController from '../controllers/CalendarController.js';
import kommoMiddleware from '../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(kommoMiddleware);

router.get('/', CalendarController.index);

router.post('/listEvents', CalendarController.listEvents);

router.post('/addEvent', CalendarController.addEvent);

router.post('/updateEvent', CalendarController.updateEvent);

router.post('/removeEvent', CalendarController.removeEvent);

export default router;
