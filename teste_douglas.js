import ThreadRepository from "./src/repositories/ThreadRepository.js";
import styled from "./src/utils/log/styled.js";
import StaticUtils from "./src/utils/StaticUtils.js";
import { runTransferirAssistente } from "./src/services/openai/tools/runTrasnferirAssistente.js";

async function main() {

  const response = await runTransferirAssistente({
    motivo: "Cliente possui Chevrolet S10 2021 LTZ, deseja acessórios com visual agressivo e esportivo, instalação na loja em Goiânia, orçamento de até R$10.000 com preferência por cartão de crédito e parcelamento.",
    lead_id: "4893366",
  });
  console.log("Response:", response);
}

main();