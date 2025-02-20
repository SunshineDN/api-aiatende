import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const LeadThread = sequelize.define('LeadThread', {
  leadID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  threadID: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  assistant_id: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  assistant_messages: {
    type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.JSON)),
    allowNull: true,
  },
  lastTimestamp: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'lead_threads', // nome da tabela no banco de dados
});

export default LeadThread;