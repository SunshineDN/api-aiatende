import styled from "./log/styled.js";

export function DifDates(data) {
  styled.info('Calculando diferença de datas...');
  styled.info('Data:', data);

  let dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

  let [dataAtualStr, horaAtualStr] = dataAtual.split(', ');
  let [diaAtual, mesAtual, anoAtual] = dataAtualStr.split('/');
  let [horaAtual, minutoAtual] = horaAtualStr.split(':');
  let dataAtualObj = new Date(`${anoAtual}-${mesAtual}-${diaAtual}T${horaAtual}:${minutoAtual}:00`);

  let [dia, mes, anoHora] = data.split('/');
  let [ano, hora] = anoHora.split(' ');
  let dataAgendamentoObj = new Date(`${ano}-${mes}-${dia}T${hora}:00`);

  let diferencaMs = dataAgendamentoObj - dataAtualObj;

  return {
    diferencaDias: Math.floor(diferencaMs / (1000 * 60 * 60 * 24)),
    diferencaHoras: Math.floor((diferencaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  };
};