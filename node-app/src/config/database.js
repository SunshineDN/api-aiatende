require('dotenv').config();
const { Sequelize } = require('sequelize');

const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_DIALECT } = process.env;
let sequelize;
if (process.env.NODE_ENV === 'production'){
  console.log('Conectando em modo produção');
  sequelize = new Sequelize(process.env.DB_URL);
} else {
  console.log('Conectando em modo dev');
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
  });
}

module.exports = sequelize;
