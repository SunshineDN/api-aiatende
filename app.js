const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const leadRouter = require('./src/routes/lead');
const gptRouter = require('./src/routes/gpt');
const messagesRouter = require('./src/routes/messages');
const accountRouter = require('./src/routes/account');
const sequelize = require('./src/config/database');
const calendarRouter = require('./src/routes/calendar');

const app = express();

app.use(cors());
app.use('/lead', leadRouter);
app.use('/gpt/v1', gptRouter);
app.use('/gpt/v2', messagesRouter);
app.use('/calendar', calendarRouter);
app.use('/account', accountRouter);

// app.use((req, res) => {
//   res.status(404).json({error: 'Endpoint não encontrado!'});
// });

app.listen(PORT, async () => {
  console.log('Servidor rodando na porta: ' + `${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');

    await sequelize.sync();
    console.log('Tabelas sincronizadas!');
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
});
