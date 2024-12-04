require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const leadRouter = require('./src/routes/lead');
const gptRouter = require('./src/routes/gpt');
const messagesRouter = require('./src/routes/messages');
const accountRouter = require('./src/routes/account');
const sequelize = require('./src/config/database');
const calendarRouter = require('./src/routes/calendar');
const calendarWebRouter = require('./src/routes/react-calendar-form');

const colors = require('colors');
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
  attention: 'bgBlue'
});

const app = express();

app.use(cors());
app.use('/lead', leadRouter);
app.use('/gpt/v1', gptRouter);
app.use('/gpt/v2', messagesRouter);
app.use('/calendar', calendarRouter);
app.use('/web/calendar', calendarWebRouter);
app.use('/account', accountRouter);

// app.use((req, res) => {
//   res.status(404).json({error: 'Endpoint não encontrado!'});
// });

app.listen(PORT, async () => {
  console.log('Servidor rodando na porta: '.info + `${PORT}`.attention);
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!'.info);

    await sequelize.sync();
    console.log('Tabelas sincronizadas!'.info);
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:'.error, error);
  }
});
