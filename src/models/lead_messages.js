import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const lead_messages = sequelize.define('lead_messages', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  author_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  messages: {
    type: DataTypes.ARRAY(DataTypes.JSON),
  }
});

export default lead_messages;