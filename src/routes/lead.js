const express = require('express');
const router = express.Router();
const LeadController = require('../controllers/LeadController');
const decodeKommoURI = require('../middlewares/decodeKommoURI');

router.use(decodeKommoURI);

router.post('/', LeadController.index);

router.post('/data-hora', LeadController.setDataWeek);

router.post('/split-fields', LeadController.setSplitFields);

module.exports = router;
