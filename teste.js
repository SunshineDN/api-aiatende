// const custom_fields = [
//   {
//     'id': 1,
//     'name': 'Field 1'
//   },
//   {
//     'id': 2,
//     'name': 'Field 2'
//   },
//   {
//     'id': 3,
//     'name': 'Field 3'
//   },
//   {
//     'id': 4,
//     'name': 'Field 4'
//   }
// ];

// const fatherFieldValues = 'Teste1;teste2;teste3;teste4;teste5';
// const father_field_split = fatherFieldValues.split(';');
// const fields_names = father_field_split.map((_, index) => `Field ${index + 1}`);
// const findField = (name) => custom_fields.filter(field => field.name === name)[0];

// let custom_fields_values = [];

// father_field_split.forEach((value, index) => {
//   const field = findField(fields_names[index]);

//   if (!field) {
//     return;
//   }

//   custom_fields_values.push({
//     'field_id': field.id,
//     'values': [
//       {
//         'value': value
//       }
//     ]
//   });
// });

// console.dir(custom_fields_values, { depth: null });

// // Verificar se os campos vindos do pai existem no array de custom_fields

// if (custom_fields_values.length === father_field_split.length && custom_fields_values.length <= father_field_split.length) {
//   console.log('Todos os campos do pai existem no array de custom_fields');
// } else {
//   console.log('Alguns campos do pai não existem no array de custom_fields');
// }

// const dataHoraBrasil = new Date('06-03-2024');
// const dataHoraUtc = new Date(dataHoraBrasil.getTime() + (dataHoraBrasil.getTimezoneOffset() * 60000));
// const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
// const weekDay = weekDays[dataHoraUtc.getDay()];
// console.log(weekDay);
// let contador = 1;
// let times = 1;
// let message = 'false';

// const wait = (ms) => {
//   return new Promise(resolve => setTimeout(resolve, ms));
// };

// const exec = async (times) => {
//   let count = 1;
//   let repeat = 1;
//   let run = {
//     status: 'running'
//   };
//   while (repeat <= times) {
//     console.log('Running assistant');
//     while (count <= 10) {
//       console.log(`${repeat}# ${count}' Run status: ${run.status}`);
//       if(run.status === 'completed') {
//         return;
//       } else if (run.status !== 'completed' && repeat === times && count === 10) {
//         throw new Error('Erro no running da menssagem do Assistant GPT');
//       }
//       await wait(1000);
//       count++;
//     }
//     count = 1;
//     repeat++;
//   }
// };

// console.log(exec(2));

// function obterDataHoraLocal() {
//   // Obter a data e hora atuais para o fuso horário de Recife
//   const dataAtual = new Date();
//   const opcoes = { 
//     timeZone: 'America/Recife',
//     year: 'numeric', 
//     month: 'numeric', 
//     day: 'numeric', 
//     hour: 'numeric', 
//     minute: 'numeric', 
//     second: 'numeric' 
//   };

//   const dataHoraLocal = dataAtual.toLocaleString('pt-BR', opcoes);

//   // Obter o dia da semana
//   const opcoesDiaSemana = { 
//     timeZone: 'America/Recife',
//     weekday: 'long'
//   };
//   const diaSemana = dataAtual.toLocaleDateString('pt-BR', opcoesDiaSemana);

//   console.log(`Data e Hora local: ${dataHoraLocal}`);
//   console.log(`Dia da semana: ${diaSemana}`);
// }

// obterDataHoraLocal();

// const { parse } = require('date-fns');

// const startDateTime = parse(
//   '03/07/2024 19:00',
//   'dd/MM/yyyy HH:mm',
//   new Date()
// );
// startDateTime.setHours(startDateTime.getHours() + 3);
// console.log(startDateTime);

// const endDateTime = new Date(startDateTime);
// endDateTime.setMinutes(endDateTime.getMinutes() + 30);
// console.log(endDateTime);

