function DifDates(data) {
  let dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

  // Passo 2: Converter a data atual para objeto Date
  let [dataAtualStr, horaAtualStr] = dataAtual.split(', ');
  let [diaAtual, mesAtual, anoAtual] = dataAtualStr.split('/');
  let [horaAtual, minutoAtual] = horaAtualStr.split(':');
  let dataAtualObj = new Date(`${anoAtual}-${mesAtual}-${diaAtual}T${horaAtual}:${minutoAtual}:00`);

  // Passo 3: Converter a data de agendamento (15/08/2024 10:00) para objeto Date
  let [dia, mes, anoHora] = data.split('/');
  let [ano, hora] = anoHora.split(' ');
  let dataAgendamentoObj = new Date(`${ano}-${mes}-${dia}T${hora}:00`);

  // Passo 4: Calcular a diferença em milissegundos
  let diferencaMs = dataAgendamentoObj - dataAtualObj;

  // Passo 5: Converter a diferença para dias e horas
  return {
    diferencaDias: Math.floor(diferencaMs / (1000 * 60 * 60 * 24)),
    diferencaHoras: Math.floor((diferencaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  }
};

module.exports = DifDates;