import cors from 'cors';
import express from 'express';
import { errorHandler } from './src/middlewares/errorHandler.js';
import prisma from './src/prisma-client.js';
import apiDocs from './src/routes/api-docs.js';
import detectContent from './src/routes/detect-content.js';
import openai from './src/routes/openai.js';
import webhook from './src/routes/webhook.js';
import kommoCalendar from './src/routes/kommo-calendar.js';

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

app.use('/api-docs', apiDocs);
app.use('/content', detectContent);
app.use('/webhook', webhook);
app.use('/atende360/v2', openai);
app.use('/kommo-calendar', kommoCalendar);

app.use((_, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado!' });
});

app.use(errorHandler);

export default app;
