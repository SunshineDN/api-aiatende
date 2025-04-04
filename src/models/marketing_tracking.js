import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const marketing_tracking = sequelize.define('marketing_tracking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  gclid: {
    type: DataTypes.STRING,
    allowNull: true,
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
  },
  utm_referrer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lead_id: {
    type: DataTypes.UUID,
    references: {
      model: 'leads', // Nome da tabela referenciada
      key: 'id', // Chave primária da tabela referenciada
    },
    allowNull: false,
  },
});

export default marketing_tracking;