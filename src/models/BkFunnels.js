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
  dentista: {
    type: DataTypes.STRING,
  },
  procedimento: {
    type: DataTypes.STRING,
  },
  periodo: {
    type: DataTypes.STRING,
  },
  turno: {
    type: DataTypes.STRING
  },
  objects: {
    type: DataTypes.JSON,
  },
  funnelId: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'BkFunnels', // nome da tabela no banco de dados
});

export default BkFunnels;