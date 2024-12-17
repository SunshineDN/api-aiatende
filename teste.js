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

const styled = require('./src/utils/log/styledLog');

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
// const listMessage = ['Olá', 'Boa tarde', 'Queria agendar', 'e saber sobre implantes', '?', 'Sim'];
// let message = '';

// if (listMessage) {
//   const sortedMessage = listMessage?.reverse();
//   const filterMessage = sortedMessage.filter((_, index) => index < 2);
//   console.log(sortedMessage);
//   message = `${filterMessage.reverse().join('\n')}
// Teste`;
// } else {
//   message = 'Teste';
// }

// console.log(message);

// const fatherFieldValues = 'Nome: Teste1; Bairro: teste2; Dentista: teste4; Data do Agendamento: teste5; Telefone: null';

// // Separar cada valor do pai em uma variavel especifica sem o nome do campo
// const nome = fatherFieldValues.split('; ').filter(value => value.includes('Nome:'))[0]?.split(': ')[1] || 'null';
// const bairro = fatherFieldValues.split('; ').filter(value => value.includes('Bairro:'))[0]?.split(': ')[1] || 'null';
// const data_nascimento = fatherFieldValues.split('; ').filter(value => value.includes('Data de Nascimento:'))[0]?.split(': ')[1] || 'null';
// const dentista = fatherFieldValues.split('; ').filter(value => value.includes('Dentista:'))[0]?.split(': ')[1] || 'null';
// const data_agendamento = fatherFieldValues.split('; ').filter(value => value.includes('Data do Agendamento:'))[0]?.split(': ')[1] || 'null';
// const telefone = fatherFieldValues.split('; ').filter(value => value.includes('Telefone:'))[0]?.split(': ')[1] || 'null';

// // Montar um objeto apenas com os dados existentes que forem diferentes de 'null'
// const data = {
//   nome: nome !== 'null' ? nome : null,
//   bairro: bairro !== 'null' ? bairro : null,
//   data_nascimento: data_nascimento !== 'null' ? data_nascimento : null,
//   dentista: dentista !== 'null' ? dentista : null,
//   data_agendamento: data_agendamento !== 'null' ? data_agendamento : null,
//   telefone: telefone !== 'null' ? telefone : null
// };
// Object?.keys(data)?.forEach(key => data[key] === null && delete data[key]);

// console.log(data);

// const obj = {
//   nome: 'Douglas Augusto Cabral da Silva',
//   bairro: 'Candeias',
//   birthdate: '11/03/2003',
//   dentist: 'Dra. Juliana Leite',
//   schedule_date: 'null',
//   reason: 'Avaliação Geral',
//   phone: '+558196724310'
// };

// const { nome, bairro, birthdate, dentist, schedule_date, reason, phone } = obj;

// if (!nome || !schedule_date || !phone) {
//   console.log('Erro ao criar / atualizar lead via agendamento por VOZ: Dados obrigatórios não informados');
// } else {
//   console.log('Lead criado via agendamento por VOZ com sucesso!');
// }


// class Teste {
//   static sum(a, b) {
//     return a + b;
//   }
// }

// class Teste2 {
//   constructor(a, b) {
//     this.a = a;
//     this.b = b;
//   }

//   soma() {
//     return Teste.sum(this.a, this.b);
//   }
// }

// const teste = new Teste2(1, 2);

// styled.errordir(teste.soma());

// console.log(BrazilianDate.getLocalDate());
// console.log(BrazilianDate.getLocalTime());
// console.log(BrazilianDate.getLocalDateTime());
// console.log(BrazilianDate.getLocalWeekDay());

// const user = {
//   name: 'Douglas Augusto Cabral da Silva',
//   email: 'example@teste.com',
//   phone: '+558196724310',
// };

// styled.function('Erro ao criar / atualizar lead via agendamento por VOZ: Dados obrigatórios não informados');
// styled.middlewaredir(user);

// Importando bibliotecas necessárias
// require('dotenv').config();

// // Exemplo de uso
// const originalID = 19030890;
// const encrypted = EncryptId(originalID);
// styled.info('Token encurtado:', encrypted);

// const restored = DecryptId(encrypted);
// styled.info('Token restaurado:', restored);

// // Verificação
// styled.info('É igual ao original?');
// if (originalID === restored) {
//   styled.success('Sim');
// } else {
//   styled.error('Não');
// }

styled.info('Console de informações');
styled.success('Console de sucesso');
styled.warning('Console de alerta');
styled.error('Console de erro');
