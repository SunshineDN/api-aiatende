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
  }
});

export default leads;