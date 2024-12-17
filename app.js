require('dotenv').config();
const express = require('express');
const cors = require('cors');
const leadRouter = require('./src/routes/lead');
const gptRouter = require('./src/routes/gpt');
const gptRouter2 = require('./src/routes/gpt/v2');
const accountRouter = require('./src/routes/account');
const calendarRouter = require('./src/routes/calendar');
const calendarWebRouter = require('./src/routes/react-calendar-form');

const app = express();

app.use(cors());
app.use('/lead', leadRouter);
app.use('/calendar', calendarRouter);
app.use('/account', accountRouter);
app.use('/gpt/v1', gptRouter);
app.use('/gpt/v2', gptRouter2);
app.use('/web/calendar', calendarWebRouter);

app.use((req, res) => {
  res.status(404).json({error: 'Endpoint não encontrado!'});
});

module.exports = app;
