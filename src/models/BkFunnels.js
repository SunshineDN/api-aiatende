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
  },
  objects: {
    type: DataTypes.ARRAY(DataTypes.JSON),
  },
  funnelID: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  }
}, {
  tableName: 'BkFunnels', // nome da tabela no banco de dados
});

export default BkFunnels;