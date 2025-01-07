import express from 'express';
import cors from 'cors';
import accountRouter from './src/routes/account.js';
import apiDocs from './src/routes/api-docs.js';
import bkFunnelRouter from './src/routes/bkfunnels.js';
import calendarRouter from './src/routes/calendar.js';
import gptRouter from './src/routes/gpt.js';
import gptRouter2 from './src/routes/gpt/v2/index.js';
import leadRouter from './src/routes/lead.js';
import calendarWebRouter from './src/routes/react-calendar-form.js';
import detectContent from './src/routes/detect-content.js';
import teste from './src/routes/teste.js';

const app = express();

app.use(cors());
app.use('/account', accountRouter);
app.use('/api-docs', apiDocs);
app.use('/bkfunnels', bkFunnelRouter);
app.use('/calendar', calendarRouter);
app.use('/gpt/v1', gptRouter);
app.use('/gpt/v2', gptRouter2);
app.use('/lead', leadRouter);
app.use('/web/calendar', calendarWebRouter);
app.use('/content', detectContent)
app.use('/teste', teste);

app.use((_, res) => {
  res.status(404).json({error: 'Endpoint não encontrado!'});
});

export default app;
