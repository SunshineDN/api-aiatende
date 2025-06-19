import express from 'express';
import KommoCalendarController from '../controllers/KommoCalendarController.js';
import kommoMiddleware from '../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(kommoMiddleware);

router.get('/', KommoCalendarController.index);

router.post('/insert-event', KommoCalendarController.insertEvent);

export default router;