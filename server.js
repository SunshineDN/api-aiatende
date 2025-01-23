import app from './app.js';
import styled from './src/utils/log/styledLog.js';
import { sequelize } from './src/config/db.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  if(process.env.PORT) {
    styled.info('Servidor rodando com porta personalizada ' + process.env.PORT + '!');
  } else {
    styled.info('Servidor rodando com porta padrão 3000!');
  }
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
