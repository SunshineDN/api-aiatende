import express from 'express';
import bodyParser from 'body-parser';
import CalendarController from '../controllers/CalendarController.js';
import { decodeKommoURI } from '../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', CalendarController.index);

router.post('/listEvents', CalendarController.listEvents);

router.post('/addEvent', CalendarController.addEvent);

router.post('/updateEvent', CalendarController.updateEvent);

router.post('/removeEvent', CalendarController.removeEvent);

export default router;
