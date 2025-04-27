import { sequelize } from '../config/db.js';
import Lead from './Lead.js';
import MarketingTracking from './MarketingTracking.js';
import LeadMessage from './LeadMessage.js';
import LeadThread from './LeadThread.js';
import BkFunnel from './BkFunnels.js';
import FunnelBuilder from './FunnelBuilder.js';

const models = {
  Lead,
  MarketingTracking,
  LeadMessage,
  LeadThread,
  BkFunnel,
  FunnelBuilder,
};

// Inicializa associações
Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { sequelize };
export default models;
