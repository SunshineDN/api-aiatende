import { sequelize } from '../config/db.js';
import Lead from './_leads.js';
import MarketingTracking from './marketing_tracking.js';
import LeadMessage from './lead_messages.js';
import LeadThread from './lead_threads.js';
import BkFunnel from './bk_funnels.js';
import FunnelBuilder from './funnel_builder.js';

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
