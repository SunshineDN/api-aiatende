import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const funnel_builder = sequelize.define('funnel_builder', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  professional: {
    type: DataTypes.JSON,
  },
  service: {
    type: DataTypes.JSON,
  },
  service_intro_page: {
    type: DataTypes.JSON,
  },
  testimony: {
    type: DataTypes.JSON,
  },
  register: {
    type: DataTypes.JSON,
  },
  period: {
    type: DataTypes.JSON,
  },
  shift: {
    type: DataTypes.JSON,
  },
});

export default funnel_builder;