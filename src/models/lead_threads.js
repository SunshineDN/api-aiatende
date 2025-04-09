import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const lead_threads = sequelize.define('lead_threads', {
  leadID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  author_id: {
    type: DataTypes.UUID,
    allowNull: true,
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
});

export default lead_threads;