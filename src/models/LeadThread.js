import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const LeadThread = sequelize.define('LeadThread', {
  lead_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  author_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  thread_id: {
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
  last_timestamp: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'lead_threads',
  underscored: true,
  timestamps: true,
});

export default LeadThread;