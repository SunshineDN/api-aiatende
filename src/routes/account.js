import express from 'express';
import AccountController from '../controllers/AccountController.js';

const router = express.Router();

router.use(express.json());

router.get('/', AccountController.index);

router.post('/verify-fields', AccountController.verifyFields);

export default router;
