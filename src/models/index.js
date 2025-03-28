import Leads from "./Leads.js";
import UTMParameters from "./UTMParameters.js";

// Definindo os relacionamentos entre os modelos
Leads.hasMany(UTMParameters, {
  foreignKey: 'lead_id',
  sourceKey: 'id',
});
UTMParameters.belongsTo(Leads, {
  foreignKey: 'lead_id',
  targetKey: 'id',
});

export { Leads, UTMParameters };