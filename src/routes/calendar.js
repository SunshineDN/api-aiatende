const express = require('express');
const router = express.Router();
const CalendarController = require('../controllers/CalendarController');
const decodeKommoURI = require('../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', CalendarController.index);

router.post('/listEvents', CalendarController.listEvents);

router.post('/list', CalendarController.list);

router.post('/addEvent', CalendarController.addEvent);

router.post('/updateEvent', CalendarController.updateEvent);

router.post('/removeEvent', CalendarController.removeEvent);

module.exports = router;
