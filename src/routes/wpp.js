import express from 'express';
import WebCalendarController from '../controllers/WppController.js';

const router = express.Router();

router.get('/', WebCalendarController.handleReceiveMessage);

export default router;