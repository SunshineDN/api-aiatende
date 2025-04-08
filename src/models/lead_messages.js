import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const lead_messages = sequelize.define('lead_messages', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  messages: {
    type: DataTypes.ARRAY(DataTypes.JSON),
  },
}, {
  tableName: 'lead_messages', // nome da tabela no banco de dados
});

export default lead_messages;