export async function runTransferirAssistente({ motivo, lead_id = "" } = {}) {
  // Transfere o atendimento para assistente humana física
  // const kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
  // await kommo.createNote({ entity_type: 'lead', entity_id: lead_id, text: `Transferido para assistente humana. Motivo: ${motivo}` });
  // return { sucesso: true, mensagem: `Transferência para atendimento humano realizada. Motivo: ${motivo}` };
  
  return {
    sucesso: false,
    mensagem: "Este serviço não está implementado.",
    motivo,
    lead_id,
  };
}