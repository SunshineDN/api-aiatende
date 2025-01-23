import styled from '../utils/log/styledLog.js';
import { Sequelize } from 'sequelize';
const sequelize = new Sequelize(process.env.DB_URL, {
  logging: styled.db,
});
export { sequelize };