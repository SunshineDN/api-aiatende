import express from 'express';
import LeadThreadsController from '../controllers/LeadThreadsController.js';

const router = express.Router();

router.use(express.json());

router.get('/', LeadThreadsController.index);

router.delete('/delete', LeadThreadsController.deleteThread);

export default router;
