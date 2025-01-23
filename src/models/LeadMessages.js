import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const LeadMessages = sequelize.define('LeadMessages', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  messages: {
    type: DataTypes.ARRAY(DataTypes.JSON),
  },
}, {
  tableName: 'LeadMessages', // nome da tabela no banco de dados
});

export default LeadMessages;