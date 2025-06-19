import app from './app.js';
import styled from './src/utils/log/styled.js';
// import { sequelize, connectWithBackoff } from './src/config/db.js';
import prisma from './src/prisma-client.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  if (process.env.PORT) {
    styled.info('Servidor rodando com porta personalizada ' + process.env.PORT + '!');
  } else {
    styled.info('Servidor rodando com porta padrão 3000!');
  }
  styled.info('Servidor rodando na porta: ' + PORT);
  try {
    await prisma.$connect();
    styled.success('Conexão com o banco de dados estabelecida!');
  } catch (error) {
    styled.error('Erro ao conectar ao banco de dados:', error);
  }
});

process.on('SIGINT', async () => {
  styled.info('Desconectando do banco de dados...');
  try {
    await prisma.$disconnect();
    styled.success('Desconectado do banco de dados com sucesso!');
  } catch (error) {
    styled.error('Erro ao desconectar do banco de dados:', error);
  }
  styled.info('Servidor encerrado.');
  process.exit(0);
});