const express = require('express');
const router = express.Router();
const CalendarController = require('../controllers/CalendarController');
const decodeKommoURI = require('../middlewares/decodeKommoURI');

router.use(decodeKommoURI);

router.post('/', CalendarController.index);

router.post('/listEvents', CalendarController.listEvents);

router.post('/addEvent', CalendarController.addEvent);

router.post('/updateEvent', CalendarController.updateEvent);

router.post('/removeEvent', CalendarController.removeEvent);

module.exports = router;
