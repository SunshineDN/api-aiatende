import styled from '../utils/log/styled.js';
import { Sequelize } from 'sequelize';
const sequelize = new Sequelize(process.env.DB_URL, {
  logging: styled.db,
  retry: {
    max: 6
  }
});

async function connectWithBackoff(retries = 5, delay = 1000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await sequelize.authenticate();
      styled.success('Conexão com o banco de dados estabelecida!');
      return sequelize;
    } catch (error) {
      styled.error(`Tentativa ${i} falhou:`, error.message);
      if (i < retries) {
        const waitTime = delay * Math.pow(2, i - 1); // Exponential backoff
        styled.info(`Aguardando ${waitTime / 1000}s para nova tentativa...`);
        await new Promise(res => setTimeout(res, waitTime));
      } else {
        styled.error('Todas as tentativas de conexão falharam.');
        throw error;
      }
    }
  }
}

export { sequelize, connectWithBackoff };