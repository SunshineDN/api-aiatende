// 1. importar e instanciar
import OpenAI from "openai";
import styled from "./src/utils/log/styled.js";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 2. definir o schema da tool
const functions = [
  {
    name: "scheduleAppointment",
    description: "Agenda uma consulta odontológica para um paciente",
    parameters: {
      type: "object",
      properties: {
        patientName: {
          type: "string",
          description: "Nome completo do paciente"
        },
        date: {
          type: "string",
          format: "date",
          description: "Data no formato YYYY-MM-DD"
        },
        time: {
          type: "string",
          pattern: "^\\d{2}:\\d{2}$",
          description: "Hora no formato HH:MM"
        },
        dentistId: {
          type: "string",
          description: "ID do dentista que vai atender"
        }
      },
      required: ["patientName", "date", "time", "dentistId"]
    }
  }
];

// 3. função auxiliar que simula a agenda no seu sistema
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

// 4. rota da sua API que recebe o chat do usuário
export async function handleChat(message) {
  const userMessage = message;

  // 5. primeira chamada: pergunta + schema de funções
  const chatResponse = await openai.chat.completions.create({
    assistant: "asst_s00UOII84sp1DpuxeRqvaG1z",
    messages: [
      { role: "user", content: userMessage }
    ],
    functions,
    function_call: "auto"  // deixa o modelo escolher quando chamar
  });

  const choice = chatResponse.choices[0].message;

  // // 6. se o modelo quis chamar nossa função...
  // if (choice.function_call) {
  //   const { name, arguments: argsJSON } = choice.function_call;
  //   const args = JSON.parse(argsJSON);

  //   // 7. executar localmente
  //   let functionResult;
  //   if (name === "scheduleAppointment") {
  //     functionResult = await scheduleAppointment(args);
  //   } else {
  //     functionResult = { error: "Função não implementada: " + name };
  //   }

  //   // 8. enviar o resultado de volta pro modelo, para ele gerar o texto final
  //   const finalResponse = await openai.chat.completions.create({
  //     assistant: "asst_s00UOII84sp1DpuxeRqvaG1z",
  //     messages: [
  //       { role: "user", content: userMessage },
  //       choice,  // a mensagem function_call do modelo
  //       {
  //         role: "function",
  //         name,
  //         content: JSON.stringify(functionResult)
  //       }
  //     ]
  //   });

  //   // 9. devolve ao frontend
  //   return res.json({
  //     reply: finalResponse.choices[0].message.content,
  //     functionResult
  //   });
  // }

  // 10. se não chamou função, resume só a resposta do assistente

  return choice;
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

// async function handleCaptureMessage(run = null) {
//   const threadId = run.thread_id;
//   const runId = run.id

//   let status;
//   do {
//     status = await openai.beta.threads.runs.retrieve(threadId, runId);
//     styled.info(status.status);

//     await new Promise(r => setTimeout(r, 500));
//   } while (status.status !== "completed" && status.status !== "requires_action");

//   if (status.status === "requires_action") {
//     const call = status.required_action;

//     if (call.type === "submit_tool_outputs") {
//       const tool_calls = call.submit_tool_outputs.tool_calls[0];
//       const function_called_name = tool_calls.function.name;
//       const functionToCall = availableTools[function_called_name];
//       const function_called_args = JSON.parse(tool_calls.function.arguments);
//       const tool_result = await functionToCall(function_called_args);
//     }
//   }

//   await handleObtainMessage(threadId);
// }

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
