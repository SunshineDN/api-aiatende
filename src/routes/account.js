const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/AccountController');

router.use(express.json());

router.get('/', AccountController.index);

router.post('/verify-fields', AccountController.verifyFields);

module.exports = router;
