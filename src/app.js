require('dotenv').config();
const express = require('express');
const cors = require('cors');
const leadRouter = require('./routes/lead');
const gptRouter = require('./routes/gpt');
const gptRouter2 = require('./routes/gpt/v2');
const accountRouter = require('./routes/account');
const calendarRouter = require('./routes/calendar');
const calendarWebRouter = require('./routes/react-calendar-form');

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
