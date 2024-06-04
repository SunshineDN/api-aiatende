const express = require('express');
const router = express.Router();
const LeadController = require('../controllers/LeadController');
const decodeKommoURI = require('../middlewares/decodeKommoURI');

router.use(decodeKommoURI);

router.get('/', LeadController.index);

router.post('/data-hora', LeadController.setDataWeek);

router.post('/split-fields/data', LeadController.setSplitDataFields);

router.post('/split-fields/scheduling', LeadController.setSplitSchedulingFields);

module.exports = router;
