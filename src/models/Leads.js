import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Leads = sequelize.define('Leads', {
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
}, {
  tableName: 'Leads', // nome da tabela no banco de dados
});

export default Leads;