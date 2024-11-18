const express = require('express');
const router = express.Router();
const CalendarController = require('../controllers/CalendarController');
const DecryptId = require('../utils/DecryptId');

router.use(express.json({ type: 'application/json' }));

router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  console.log('Request Type: ', req.method);
  console.log('Request URL: ', req.originalUrl);
  req.body.lead_id = DecryptId(req.body.lead_id);
  console.log('Request Body: ', req.body);
  next();
});

router.get('/', CalendarController.index);

router.post('/listEvents', CalendarController.listEventsWeb);

module.exports = router;
