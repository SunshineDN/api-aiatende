import express from 'express';
import LeadController from '../controllers/LeadController.js';
import kommoMiddleware from '../middlewares/kommoMiddleware.js';
import createLeadMiddleware from '../middlewares/createLeadMiddleware.js';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

const leadController = new LeadController();

router.get('/', leadController.index);

router.post('/data-hora', kommoMiddleware, leadController.setDataWeek);

router.post('/split-fields/data', kommoMiddleware, leadController.setSplitDataFields);

router.post('/split-fields/scheduling', kommoMiddleware, leadController.setSplitSchedulingFields);

router.post('/add-tel', kommoMiddleware, leadController.addTelephone);

router.post('/webhook/create', createLeadMiddleware, leadController.webhookCreate);

export default router;
