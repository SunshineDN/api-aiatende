import express from 'express';
import bodyParser from 'body-parser';
import LeadController from '../controllers/LeadController.js';
import { decodeKommoURI } from '../middlewares/decodeKommoURI.js';

const router = express.Router();

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', LeadController.index);

router.post('/data-hora', LeadController.setDataWeek);

router.post('/split-fields/data', LeadController.setSplitDataFields);

router.post('/split-fields/scheduling', LeadController.setSplitSchedulingFields);

router.post('/add-tel', LeadController.addTelephone);

router.post('/created', LeadController.setCalendarForm);

export default router;
