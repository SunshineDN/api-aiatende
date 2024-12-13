require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const leadRouter = require('./src/routes/lead');
const gptRouter = require('./src/routes/gpt');
const messagesRouter = require('./src/routes/messages');
const recepcaoAssistente = require('./src/routes/messages/recepcao/assistant/assistant');
const recepcaoPrompt = require('./src/routes/messages/recepcao/prompt/prompt');
const accountRouter = require('./src/routes/account');
const sequelize = require('./src/config/database');
const calendarRouter = require('./src/routes/calendar');
const calendarWebRouter = require('./src/routes/react-calendar-form');
const styled = require('./src/utils/log/styledLog');

const app = express();

app.use(cors());
app.use('/lead', leadRouter);
app.use('/calendar', calendarRouter);
app.use('/account', accountRouter);
app.use('/gpt/v1', gptRouter);
app.use('/gpt/v2', [messagesRouter, recepcaoAssistente, recepcaoPrompt]);
app.use('/web/calendar', calendarWebRouter);

app.use((req, res) => {
  res.status(404).json({error: 'Endpoint não encontrado!'});
});

app.listen(PORT, async () => {
  styled.info('Servidor rodando na porta: ' + PORT);
  try {
    await sequelize.authenticate();
    styled.success('Conexão com o banco de dados estabelecida com sucesso!');

    await sequelize.sync();
    styled.success('Tabelas sincronizadas!');
  } catch (error) {
    styled.error('Erro ao conectar com o banco de dados:', error);
  }
});
