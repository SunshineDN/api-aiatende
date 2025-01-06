import express from 'express';
import LeadController from '../controllers/LeadController.js';
import kommoMiddleware from '../middlewares/kommoMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(kommoMiddleware);

router.get('/', LeadController.index);

router.post('/data-hora', LeadController.setDataWeek);

router.post('/split-fields/data', LeadController.setSplitDataFields);

router.post('/split-fields/scheduling', LeadController.setSplitSchedulingFields);

router.post('/add-tel', LeadController.addTelephone);

router.post('/created', LeadController.setCalendarForm);

export default router;
