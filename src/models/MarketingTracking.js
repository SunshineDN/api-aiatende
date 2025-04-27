import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const MarketingTracking = sequelize.define('MarketingTracking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  client_id: { type: DataTypes.STRING, allowNull: true, },
  gclid: { type: DataTypes.STRING, allowNull: true, },
  fbclid: { type: DataTypes.STRING, allowNull: true, },
  fbp: { type: DataTypes.STRING, allowNull: true, },
  hash: { type: DataTypes.STRING(8), allowNull: true, },


  utm_source: { type: DataTypes.STRING, allowNull: true },
  utm_medium: { type: DataTypes.STRING, allowNull: true },
  utm_campaign: { type: DataTypes.STRING, allowNull: true },
  utm_term: { type: DataTypes.STRING, allowNull: true },
  utm_content: { type: DataTypes.STRING, allowNull: true },
  utm_referrer: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'marketing_tracking',
  underscored: true,
  timestamps: true,
});

MarketingTracking.associate = models => {
  MarketingTracking.hasMany(models.Lead, {
    foreignKey: 'marketing_tracking_id',
    as: 'leads',
  });
}

export default MarketingTracking;
