export async function runMostrarFrete({ cep, bairro = "" } = {}) {
  // Calcula ou exibe a taxa de entrega com base na localização
  // const frete = await ShippingUtils.getFreteByCep(cep, bairro);

  return {
    sucesso: false,
    mensagem: "Este serviço não está implementado.",
    cep,
    bairro,
  };
}