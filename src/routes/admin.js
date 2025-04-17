import express from 'express';
import AdminController from '../controllers/AdminController.js';

const router = express.Router();

router.use(express.json());

// Lead threads
router.get('/lead-threads/:lead_id', AdminController.getLeadThreads);

router.delete('/lead-threads/:lead_id', AdminController.deleteLeadThreads);

// Lead messages
router.get('/lead-messages/:lead_id', AdminController.getLeadMessages);

router.delete('/lead-messages/:lead_id', AdminController.deleteLeadMessages);

// Lead bk funnels
router.get('/lead-bk-funnels/:lead_id', AdminController.getLeadBkFunnels);

router.delete('/lead-bk-funnels/:lead_id', AdminController.deleteLeadBkFunnels);

export default router;