import KommoServices from "../../kommo/KommoServices.js";
import KommoUtils from "../../../utils/KommoUtils.js";

export async function runTransferirAssistente({ motivo, lead_id = "" } = {}) {
  // Transfere o atendimento para assistente humana física
  const kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
  const kommoUtils = new KommoUtils({ users: await kommo.getUsers(), leads_custom_fields: await kommo.getLeadsCustomFields(), pipelines: await kommo.getPipelines() }); 

  if (!motivo || !lead_id) {
    return {
      sucesso: false,
      mensagem: "Motivo e lead_id são obrigatórios para transferir o atendimento.",
    };
  }

  let custom_fields_values = [];

  if (motivo) {
    const motivoField = kommoUtils.findLeadsFieldByName("Motivo");
    if (motivoField) {
      custom_fields_values.push({
        field_id: motivoField.id,
        values: [{ value: motivo }],
      });
    }
  }

  const responsibleUser = kommoUtils.findUserByName("Dpto Vendas");

  const status = kommoUtils.findStatusByCode("qualificado", 142);

  const updateLead = await kommo.updateLead({ id: lead_id, pipeline_id: status.pipeline_id, status_id: status.id, custom_fields_values, responsible_user_id: responsibleUser.id });

  const updateTask = await kommo.createTaskInLead({ entity_type: 'leads', entity_id: lead_id, text: `Transferido para assistente humana. Motivo: ${motivo}`, responsible_user_id: responsibleUser.id });
  return { sucesso: true, mensagem: `Transferência para atendimento humano realizada. Motivo: ${motivo}`, updated: { lead: updateLead, task: updateTask } };
}