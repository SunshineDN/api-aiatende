import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const FunnelBuilder = sequelize.define('FunnelBuilder', {
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
}, {
  tableName: 'FunnelBuilder', // nome da tabela no banco de dados
});

export default FunnelBuilder;