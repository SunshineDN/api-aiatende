// 1. importar e instanciar
import OpenAI from "openai";
import styled from "./src/utils/log/styled.js";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function scheduleAppointment({ patientName, date, time, dentistId }) {
  // aqui você faria o .insert() no seu banco, chamaria outro serviço etc.
  // vamos simular respondendo um ID de agendamento:
  return {
    appointmentId: "appt_" + Date.now(),
    patientName,
    date,
    time,
    dentistId,
    status: "confirmed"
  };
}

const availableTools = {
  scheduleAppointment
}

const threadId = "thread_sIybowHrdoRpg56tXEUVBrFk"
// const runId = "run_V2pQXatzX0VPoN99r4oE23jV"

async function handleChatWithThreads(message) {
  const userMessage = message;

  // const { id: threadId } = await openai.beta.threads.create();

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: userMessage
  });

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: "asst_s00UOII84sp1DpuxeRqvaG1z"
  });

  styled.infodir(run);
  return run;
}

async function handleObtainMessage(thread_id) {
  const allMessages = await openai.beta.threads.messages.list(thread_id);
  allMessages.data = allMessages.data.slice().reverse();
  styled.infodir(allMessages);
}

async function handleCaptureMessage(run) {
  const threadId = run.thread_id;
  const runId = run.id;

  while (true) {
    // 1) recuperar o status do run
    const status = await openai.beta.threads.runs.retrieve(threadId, runId);
    styled.info(status.status);

    // 2) se precisar rodar tool...
    if (status.status === "requires_action") {
      const call = status.required_action;

      if (call.type === "submit_tool_outputs") {
        // 2.1 descompactar chamada
        const toolCall = call.submit_tool_outputs.tool_calls[0];
        const fnName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        // 2.2 executar sua lógica local
        const result = await availableTools[fnName](args);

        styled.infodir(result);

        // 2.3 submeter o resultado ao run
        await openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
          tool_outputs: [
            { tool_call_id: toolCall.id, output: JSON.stringify(result) }
          ]
        });

        // voltar ao topo do loop para polling
        continue;
      }
    }

    // 3) se completou, sai do loop
    if (status.status === "completed") {
      break;
    }

    // 4) se ainda está “running”, aguarda e repete
    await new Promise(r => setTimeout(r, 500));
  }

  // 5) agora que o run terminou, obtém a mensagem
  await handleObtainMessage(threadId);
}

const main = async () => {
  const message = "06/05/2025 às 14h"
  const run = await handleChatWithThreads(message);

  await handleCaptureMessage(run);
}

main();
