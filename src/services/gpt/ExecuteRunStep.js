const ExecuteRunStep = async (openai, thread_id, assistant_id, repeat, times) => {
  console.log('Creating and monitoring run...');
  let count = 1;
  const run = await openai.beta.threads.runs.create(
    thread_id,
    { assistant_id }
  );

  const intervalId = setInterval(async () => {
    const currentRun = await openai.beta.threads.runs.retrieve(
      thread_id,
      run.id
    );
    console.log(`${repeat}# ${count}' Run status: ${currentRun.status}`);

    if (currentRun.status === 'completed') {
      console.log('Run completed');
      clearInterval(intervalId);
      return;
    } else if (currentRun.status !== 'completed' && repeat === times && count === 10) {
      console.log('Run not completed');
      clearInterval(intervalId);
      if (currentRun.status === 'failed') {
        console.log('Run failed');
        throw new Error(`Erro no running da mensagem do Assistant GPT: ${currentRun?.last_error?.message}`);
      } else if (currentRun.status === 'expired') {
        console.log('Run expired');
        throw new Error('O tempo de execução do Assistant GPT expirou');
      }
    }
    if (count >= 10) {
      console.log('Count exceeded\n');
      clearInterval(intervalId);
      await cancelRun(thread_id, run.id);
      return;
    }
    count++;
  }, 1000);
};

const cancelRun = async (openai, thread_id, runId) => {
  console.log('Cancelling run...');
  let run = await openai.beta.threads.runs.cancel(
    thread_id,
    runId
  );
  const intervalId = setInterval(async () => {
    run = await openai.beta.threads.runs.retrieve(
      thread_id,
      runId
    );
    console.log('Run status for cancel:', run.status);
    if (run.status === 'cancelled' || run.status === 'expired') {
      console.log('Run cancelled');
      clearInterval(intervalId);
    }
  }, 1000);
};

// const ExecuteRun = async (times) => {
//   for (i = 1; i <= times; i++) {
//     await createAndMonitorRun(openai, thread_id, assistant_id, repeat, times);
//   }
// };

module.exports = ExecuteRunStep;