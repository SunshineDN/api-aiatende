require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const leadRouter = require('./src/routes/lead');
const gptRouter = require('./src/routes/gpt');
const calendarRouter = require('./src/routes/calendar');

const app = express();

app.use(bodyParser.text({ type: '*/*' }));
app.use(cors());
app.use('/lead', leadRouter);
app.use('/gpt/v1', gptRouter);
app.use('/calendar', calendarRouter);

app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT + '...');
});
