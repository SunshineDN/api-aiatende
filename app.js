import express from 'express';
import cors from 'cors';
import accountRouter from './src/routes/account.js';
import apiDocs from './src/routes/api-docs.js';
import bkFunnelRouter from './src/routes/bkfunnels.js';
import calendarRouter from './src/routes/calendar.js';
import funnelbuilder from './src/routes/funnelbuilder.js';
import gptRouter from './src/routes/gpt.js';
import gptRouter2 from './src/routes/gpt/v2/index.js';
import leadRouter from './src/routes/lead.js';
import calendarWebRouter from './src/routes/react-calendar-form.js';
import detectContent from './src/routes/detect-content.js';
import webhook from './src/routes/webhook.js';
import leadThreads from './src/routes/leadthreads.js';
import admin from './src/routes/admin.js';
import teste from './src/routes/teste.js';
import wpp from './src/routes/wpp.js';
import openai from './src/routes/openai.js';
import prisma from './src/prisma-client.js';

const app = express();

app.use(cors());

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'UP', database: 'OK' });
  } catch (error) {
    return res.status(503).json({
      status: 'DOWN',
      database: 'ERROR',
      message: error.message
    });
  }
});

app.use('/account', accountRouter);
app.use('/api-docs', apiDocs);
app.use('/bkfunnels', bkFunnelRouter);
app.use('/calendar', calendarRouter);
app.use('/funnelbuilder', funnelbuilder);
app.use('/gpt/v1', gptRouter);
app.use('/gpt/v2', gptRouter2);
app.use('/lead', leadRouter);
app.use('/web/calendar', calendarWebRouter);
app.use('/content', detectContent);
app.use('/webhook', webhook);
app.use('/lead-threads', leadThreads);
app.use('/admin', admin);
app.use('/teste', teste);
app.use('/wpp', wpp);
app.use('/atende360/v2', openai);

app.use((_, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado!' });
});

export default app;
