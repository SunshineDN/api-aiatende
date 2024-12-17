const app = require('./src/app');
const sequelize = require('./src/config/database');
const styled = require('./src/utils/log/styledLog');
const PORT = process.env.PORT || 3000;

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
