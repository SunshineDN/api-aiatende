const express = require('express');
const router = express.Router();
const CalendarController = require('../controllers/CalendarController');
const decryptId = require('../utils/crypt/DecryptId');
const styled = require('../utils/log/styledLog');

router.use(express.json({ type: 'application/json' }));

router.use((req, res, next) => {
  styled.info('Time: ', Date.now());
  styled.info('Request Type: ', req.method);
  styled.info('Request URL: ', req.originalUrl);
  req.body.lead_id = decryptId(req.body.lead_id);
  styled.info('Request Body: ', req.body);
  next();
});

router.get('/', CalendarController.index);

router.post('/listEvents', CalendarController.listEventsWeb);

module.exports = router;
