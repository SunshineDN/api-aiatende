const express = require('express');
const styled = require('../utils/log/styledLog');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use((req, _, next) => {
  styled.info('Middleware após o express.urlencoded');
  styled.infodir(req.body);
  next();
})

router.post('/', (_, res) => {
  res.send('Rota POST /');
})

module.exports = router;
