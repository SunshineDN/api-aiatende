import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const BkFunnels = sequelize.define('BkFunnels', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  quests: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  dentista: { type: DataTypes.STRING, allowNull: true },
  procedimento: { type: DataTypes.STRING, allowNull: true },
  periodo: { type: DataTypes.STRING, allowNull: true },
  turno: { type: DataTypes.STRING, allowNull: true },
  objects: { type: DataTypes.JSON, allowNull: true },
  funnel_id: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'bk_funnels',
  underscored: true,
  timestamps: true,
});

export default BkFunnels;