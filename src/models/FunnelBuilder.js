import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const FunnelBuilder = sequelize.define('FunnelBuilder', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  professional: { type: DataTypes.JSON, allowNull: true },
  service: { type: DataTypes.JSON, allowNull: true },
  service_intro_page: { type: DataTypes.JSON, allowNull: true },
  testimony: { type: DataTypes.JSON, allowNull: true },
  register: { type: DataTypes.JSON, allowNull: true },
  period: { type: DataTypes.JSON, allowNull: true },
  shift: { type: DataTypes.JSON, allowNull: true }
}, {
  tableName: 'funnel_builder',
  underscored: true,
  timestamps: true,
});

export default FunnelBuilder;