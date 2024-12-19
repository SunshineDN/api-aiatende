import express from 'express';
import cors from 'cors';
import teste from './routes/teste.js';
import apiDocs from './routes/api-docs.js';
import leadRouter from './routes/lead.js';
import calendarRouter from './routes/calendar.js';
import accountRouter from './routes/account.js';
import gptRouter from './routes/gpt.js';
import gptRouter2 from './routes/gpt/v2/index.js';
import calendarWebRouter from './routes/react-calendar-form.js';

const app = express();

app.use(cors());
app.use('/teste', teste);
app.use('/api-docs', apiDocs);
app.use('/lead', leadRouter);
app.use('/calendar', calendarRouter);
app.use('/account', accountRouter);
app.use('/gpt/v1', gptRouter);
app.use('/gpt/v2', gptRouter2);
app.use('/web/calendar', calendarWebRouter);

app.use((_, res) => {
  res.status(404).json({error: 'Endpoint não encontrado!'});
});

export default app;
