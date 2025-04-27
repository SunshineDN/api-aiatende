import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const LeadMessage = sequelize.define('LeadMessage', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  author_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  messages: {
    type: DataTypes.ARRAY(DataTypes.JSON),
  }
}, {
  tableName: 'lead_messages',
  underscored: true,
  timestamps: true,
});

export default LeadMessage;