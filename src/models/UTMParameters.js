import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const UTMParameters = sequelize.define('UTM Parameters', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  utm_source: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  utm_medium: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  utm_campaign: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  utm_term: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  utm_content: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

export default UTMParameters;