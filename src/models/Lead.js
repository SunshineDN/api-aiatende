import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  lead_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  marketing_tracking_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'marketing_tracking',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
}, {
  tableName: 'leads',
  underscored: true,
  timestamps: true,
});

Lead.associate = models => {
  Lead.belongsTo(models.MarketingTracking, {
    foreignKey: 'marketing_tracking_id',
    as: 'marketing_tracking',
  });
}

export default Lead;