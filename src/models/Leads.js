import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const leads = sequelize.define('leads', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
  },
  marketing_tracking_id: {
    type: DataTypes.UUID,
    references: {
      model: 'marketing_tracking',
      key: 'id',
    },
    allowNull: true,
  },
});

export default leads;