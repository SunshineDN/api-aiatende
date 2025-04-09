import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const bk_funnels = sequelize.define('bk_funnels', {
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
});

export default bk_funnels;