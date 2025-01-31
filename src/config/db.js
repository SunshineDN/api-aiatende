import styled from '../utils/log/styled.js';
import { Sequelize } from 'sequelize';
const sequelize = new Sequelize(process.env.DB_URL, {
  logging: styled.db,
});
export { sequelize };