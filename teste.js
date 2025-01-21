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

import styled from './src/utils/log/styledLog.js';

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
// 

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

// styled.info('Console de informações');
// styled.success('Console de sucesso');
// styled.warning('Console de alerta');
// styled.error('Console de erro');

// styled.info(process.env.DB_URL)

// import path from 'path';
// const __dirname = path.resolve();
// styled.info(__dirname);
// styled.info('Caminho do root:', path.join(__dirname, 'src'));

// const obj = {
//   name: 'Douglas',
//   datanascimento: '11/03/2003',
//   dentista: 'Dra. Juliana Leite',
//   arr: [1, 2, 3, 4, 5]
// }

// const { name, datanascimento, dentista, arr } = obj;

// console.log(name, datanascimento, dentista, arr);

//Encode the String to Base64
// const string = 'f881B1'
// const encodedString = Buffer.from(string).toString('base64');
// console.log(encodedString);

// //Decode the Base64 encoded String
// const decodedString = Buffer.from(encodedString, 'base64').toString('utf-8');
// console.log(decodedString);

// import KommoServices from './src/services/kommo/KommoServices.js';
// const kommo = new KommoServices();
// console.log(kommo.listLeads());

// const leads = [
//   {
//     "id": 19030890,
//     "name": "PARA TESTES - NÃO APAGUE",
//     "price": 0,
//     "responsible_user_id": 10402999,
//     "group_id": 0,
//     "status_id": 73195524,
//     "pipeline_id": 8933063,
//     "loss_reason_id": null,
//     "created_by": 0,
//     "updated_by": 7421899,
//     "created_at": 1730486656,
//     "updated_at": 1735843186,
//     "closed_at": null,
//     "closest_task_at": null,
//     "is_deleted": false,
//     "custom_fields_values": [
//       {
//         "field_id": 1276648,
//         "field_name": "Recebeu Mensagem",
//         "field_code": null,
//         "field_type": "checkbox",
//         "values": [
//           {
//             "value": true
//           }
//         ]
//       },
//       {
//         "field_id": 1271495,
//         "field_name": "CANAL DE ENTRADA",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "01 - WHATSAPP LITE",
//             "enum_id": 919467,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1251814,
//         "field_name": "Marketing",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "00 - INDEFINIDO",
//             "enum_id": 922465,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1268288,
//         "field_name": "GPT | Last messages",
//         "field_code": null,
//         "field_type": "textarea",
//         "values": [
//           {
//             "value": "É pra pagar\nSe quiser pode colocar meu notebook lá\nNo grupo é só pra avisos\nEu tô falando com ele aq"
//           }
//         ]
//       },
//       {
//         "field_id": 1273751,
//         "field_name": "Funil",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "ADMINISTRATIVO",
//             "enum_id": 921395,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1273753,
//         "field_name": "Tipo de Lead",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "Quente",
//             "enum_id": 921387,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1274935,
//         "field_name": "Voz",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "nova",
//             "enum_id": 922315,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1275209,
//         "field_name": "Tempo sem retorno",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "6 Dias",
//             "enum_id": 922557,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1275201,
//         "field_name": "Agendar - Manual",
//         "field_code": null,
//         "field_type": "url",
//         "values": [
//           {
//             "value": "https://forms.kommo.com/rtzcrzv?dp=Q1zaSQHqO-hHArUG1UMtpYOcpL5i8iTu6ibH1PbsjtuzePTd32GOr_oD8YuHOsij"
//           }
//         ]
//       },
//       {
//         "field_id": 1267772,
//         "field_name": "GPT | Message received",
//         "field_code": null,
//         "field_type": "textarea",
//         "values": [
//           {
//             "value": "Olá boa noite, me chamo Douglas"
//           }
//         ]
//       },
//       {
//         "field_id": 1273839,
//         "field_name": "GPT | Bot running",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "AQUECIMENTO - ASSISTANT | AQUECIMENTO LEAD",
//             "enum_id": 921731,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1251816,
//         "field_name": "Motivo Consulta",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "Ortodontia | Invisalign",
//             "enum_id": 894520,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1280049,
//         "field_name": "Calendário",
//         "field_code": null,
//         "field_type": "url",
//         "values": [
//           {
//             "value": "https://formulariotest.com/03b4b7324c66abc6b124c7d8ff7d4f4d"
//           }
//         ]
//       },
//       {
//         "field_id": 1267762,
//         "field_name": "GPT | Answer",
//         "field_code": null,
//         "field_type": "textarea",
//         "values": [
//           {
//             "value": "Como posso te ajudar mais hoje?"
//           }
//         ]
//       },
//       {
//         "field_id": 1275699,
//         "field_name": "Etapa",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "INDEFINIDO [QUENTE]",
//             "enum_id": 923215,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1273845,
//         "field_name": "GPT | Last Answer",
//         "field_code": null,
//         "field_type": "textarea",
//         "values": [
//           {
//             "value": "Olá, Douglas! Boa noite. Que bom te ver por aqui. \n\nGostaria de saber mais sobre algum tratamento específico ou sobre a Clínica Dental Santé? Temos uma equipe especializada e estrutura moderna que fará a diferença na sua atendimento. Estou à disposição para ajudar!"
//           }
//         ]
//       },
//       {
//         "field_id": 1274617,
//         "field_name": "Last Bot Runned",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "AQUECIMENTO 1/1",
//             "enum_id": 922041,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1251804,
//         "field_name": "Dentista",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "Dra. Juliana Leite",
//             "enum_id": 894424,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1251802,
//         "field_name": "Data do Agendamento",
//         "field_code": null,
//         "field_type": "date_time",
//         "values": [
//           {
//             "value": 1734012000
//           }
//         ]
//       },
//       {
//         "field_id": 1276872,
//         "field_name": "Last Agendamento",
//         "field_code": null,
//         "field_type": "date_time",
//         "values": [
//           {
//             "value": 1733751000
//           }
//         ]
//       },
//       {
//         "field_id": 1251806,
//         "field_name": "Tipo de Consulta",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "Particular",
//             "enum_id": 894464,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1278572,
//         "field_name": "Status do Agendamento",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "Confirmou",
//             "enum_id": 927122,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1273841,
//         "field_name": "Data escolhida",
//         "field_code": null,
//         "field_type": "text",
//         "values": [
//           {
//             "value": "12/12/2024 11:00"
//           }
//         ]
//       },
//       {
//         "field_id": 1276694,
//         "field_name": "FUNIL",
//         "field_code": null,
//         "field_type": "multiselect",
//         "values": [
//           {
//             "value": "03 - PRÉ-AGENDAMENTO",
//             "enum_id": 925364,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1273507,
//         "field_name": "Mensagem",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "24 Horas ( 7 dias )",
//             "enum_id": 921087,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1268746,
//         "field_name": "GPT | Sent Audio",
//         "field_code": null,
//         "field_type": "checkbox",
//         "values": [
//           {
//             "value": true
//           }
//         ]
//       },
//       {
//         "field_id": 1269532,
//         "field_name": "Registration Data",
//         "field_code": null,
//         "field_type": "textarea",
//         "values": [
//           {
//             "value": "Douglas Augusto; 11/03/2003; Candeias"
//           }
//         ]
//       },
//       {
//         "field_id": 1277048,
//         "field_name": "Bairro",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "Candeias",
//             "enum_id": 925828,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1269522,
//         "field_name": "Scheduling field 1",
//         "field_code": null,
//         "field_type": "text",
//         "values": [
//           {
//             "value": "Douglas Augusto"
//           }
//         ]
//       },
//       {
//         "field_id": 1269524,
//         "field_name": "Scheduling field 2",
//         "field_code": null,
//         "field_type": "text",
//         "values": [
//           {
//             "value": "11/03/2003"
//           }
//         ]
//       },
//       {
//         "field_id": 1269526,
//         "field_name": "Scheduling field 3",
//         "field_code": null,
//         "field_type": "text",
//         "values": [
//           {
//             "value": "Candeias"
//           }
//         ]
//       },
//       {
//         "field_id": 1269546,
//         "field_name": "Return Data",
//         "field_code": null,
//         "field_type": "checkbox",
//         "values": [
//           {
//             "value": true
//           }
//         ]
//       },
//       {
//         "field_id": 1251460,
//         "field_name": "Data de Nascimento",
//         "field_code": null,
//         "field_type": "birthday",
//         "values": [
//           {
//             "value": 1047265200
//           }
//         ]
//       },
//       {
//         "field_id": 1282147,
//         "field_name": "BK Funnels ID",
//         "field_code": null,
//         "field_type": "text",
//         "values": [
//           {
//             "value": "f881B1"
//           }
//         ]
//       }
//     ],
//     "score": null,
//     "account_id": 32000011,
//     "labor_cost": null,
//     "_links": {
//       "self": {
//         "href": "https://kommoagendamento.kommo.com/api/v4/leads/19030890?query=f881B1&page=1&limit=250"
//       }
//     },
//     "_embedded": {
//       "tags": [],
//       "companies": []
//     }
//   },{
//     "id": 19030890,
//     "name": "PARA TESTES - NÃO APAGUE",
//     "price": 0,
//     "responsible_user_id": 10402999,
//     "group_id": 0,
//     "status_id": 73195524,
//     "pipeline_id": 8933063,
//     "loss_reason_id": null,
//     "created_by": 0,
//     "updated_by": 7421899,
//     "created_at": 1730486656,
//     "updated_at": 1735843186,
//     "closed_at": null,
//     "closest_task_at": null,
//     "is_deleted": false,
//     "custom_fields_values": [
//       {
//         "field_id": 1276648,
//         "field_name": "Recebeu Mensagem",
//         "field_code": null,
//         "field_type": "checkbox",
//         "values": [
//           {
//             "value": true
//           }
//         ]
//       },
//       {
//         "field_id": 1271495,
//         "field_name": "CANAL DE ENTRADA",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "01 - WHATSAPP LITE",
//             "enum_id": 919467,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1251814,
//         "field_name": "Marketing",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "00 - INDEFINIDO",
//             "enum_id": 922465,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1268288,
//         "field_name": "GPT | Last messages",
//         "field_code": null,
//         "field_type": "textarea",
//         "values": [
//           {
//             "value": "É pra pagar\nSe quiser pode colocar meu notebook lá\nNo grupo é só pra avisos\nEu tô falando com ele aq"
//           }
//         ]
//       },
//       {
//         "field_id": 1273751,
//         "field_name": "Funil",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "ADMINISTRATIVO",
//             "enum_id": 921395,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1273753,
//         "field_name": "Tipo de Lead",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "Quente",
//             "enum_id": 921387,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1274935,
//         "field_name": "Voz",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "nova",
//             "enum_id": 922315,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1275209,
//         "field_name": "Tempo sem retorno",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "6 Dias",
//             "enum_id": 922557,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1275201,
//         "field_name": "Agendar - Manual",
//         "field_code": null,
//         "field_type": "url",
//         "values": [
//           {
//             "value": "https://forms.kommo.com/rtzcrzv?dp=Q1zaSQHqO-hHArUG1UMtpYOcpL5i8iTu6ibH1PbsjtuzePTd32GOr_oD8YuHOsij"
//           }
//         ]
//       },
//       {
//         "field_id": 1267772,
//         "field_name": "GPT | Message received",
//         "field_code": null,
//         "field_type": "textarea",
//         "values": [
//           {
//             "value": "Olá boa noite, me chamo Douglas"
//           }
//         ]
//       },
//       {
//         "field_id": 1273839,
//         "field_name": "GPT | Bot running",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "AQUECIMENTO - ASSISTANT | AQUECIMENTO LEAD",
//             "enum_id": 921731,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1251816,
//         "field_name": "Motivo Consulta",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "Ortodontia | Invisalign",
//             "enum_id": 894520,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1280049,
//         "field_name": "Calendário",
//         "field_code": null,
//         "field_type": "url",
//         "values": [
//           {
//             "value": "https://formulariotest.com/03b4b7324c66abc6b124c7d8ff7d4f4d"
//           }
//         ]
//       },
//       {
//         "field_id": 1267762,
//         "field_name": "GPT | Answer",
//         "field_code": null,
//         "field_type": "textarea",
//         "values": [
//           {
//             "value": "Como posso te ajudar mais hoje?"
//           }
//         ]
//       },
//       {
//         "field_id": 1275699,
//         "field_name": "Etapa",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "INDEFINIDO [QUENTE]",
//             "enum_id": 923215,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1273845,
//         "field_name": "GPT | Last Answer",
//         "field_code": null,
//         "field_type": "textarea",
//         "values": [
//           {
//             "value": "Olá, Douglas! Boa noite. Que bom te ver por aqui. \n\nGostaria de saber mais sobre algum tratamento específico ou sobre a Clínica Dental Santé? Temos uma equipe especializada e estrutura moderna que fará a diferença na sua atendimento. Estou à disposição para ajudar!"
//           }
//         ]
//       },
//       {
//         "field_id": 1274617,
//         "field_name": "Last Bot Runned",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "AQUECIMENTO 1/1",
//             "enum_id": 922041,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1251804,
//         "field_name": "Dentista",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "Dra. Juliana Leite",
//             "enum_id": 894424,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1251802,
//         "field_name": "Data do Agendamento",
//         "field_code": null,
//         "field_type": "date_time",
//         "values": [
//           {
//             "value": 1734012000
//           }
//         ]
//       },
//       {
//         "field_id": 1276872,
//         "field_name": "Last Agendamento",
//         "field_code": null,
//         "field_type": "date_time",
//         "values": [
//           {
//             "value": 1733751000
//           }
//         ]
//       },
//       {
//         "field_id": 1251806,
//         "field_name": "Tipo de Consulta",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "Particular",
//             "enum_id": 894464,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1278572,
//         "field_name": "Status do Agendamento",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "Confirmou",
//             "enum_id": 927122,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1273841,
//         "field_name": "Data escolhida",
//         "field_code": null,
//         "field_type": "text",
//         "values": [
//           {
//             "value": "12/12/2024 11:00"
//           }
//         ]
//       },
//       {
//         "field_id": 1276694,
//         "field_name": "FUNIL",
//         "field_code": null,
//         "field_type": "multiselect",
//         "values": [
//           {
//             "value": "03 - PRÉ-AGENDAMENTO",
//             "enum_id": 925364,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1273507,
//         "field_name": "Mensagem",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "24 Horas ( 7 dias )",
//             "enum_id": 921087,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1268746,
//         "field_name": "GPT | Sent Audio",
//         "field_code": null,
//         "field_type": "checkbox",
//         "values": [
//           {
//             "value": true
//           }
//         ]
//       },
//       {
//         "field_id": 1269532,
//         "field_name": "Registration Data",
//         "field_code": null,
//         "field_type": "textarea",
//         "values": [
//           {
//             "value": "Douglas Augusto; 11/03/2003; Candeias"
//           }
//         ]
//       },
//       {
//         "field_id": 1277048,
//         "field_name": "Bairro",
//         "field_code": null,
//         "field_type": "select",
//         "values": [
//           {
//             "value": "Candeias",
//             "enum_id": 925828,
//             "enum_code": null
//           }
//         ]
//       },
//       {
//         "field_id": 1269522,
//         "field_name": "Scheduling field 1",
//         "field_code": null,
//         "field_type": "text",
//         "values": [
//           {
//             "value": "Douglas Augusto"
//           }
//         ]
//       },
//       {
//         "field_id": 1269524,
//         "field_name": "Scheduling field 2",
//         "field_code": null,
//         "field_type": "text",
//         "values": [
//           {
//             "value": "11/03/2003"
//           }
//         ]
//       },
//       {
//         "field_id": 1269526,
//         "field_name": "Scheduling field 3",
//         "field_code": null,
//         "field_type": "text",
//         "values": [
//           {
//             "value": "Candeias"
//           }
//         ]
//       },
//       {
//         "field_id": 1269546,
//         "field_name": "Return Data",
//         "field_code": null,
//         "field_type": "checkbox",
//         "values": [
//           {
//             "value": true
//           }
//         ]
//       },
//       {
//         "field_id": 1251460,
//         "field_name": "Data de Nascimento",
//         "field_code": null,
//         "field_type": "birthday",
//         "values": [
//           {
//             "value": 1047265200
//           }
//         ]
//       },
//       {
//         "field_id": 1282147,
//         "field_name": "BK Funnels ID",
//         "field_code": null,
//         "field_type": "text",
//         "values": [
//           {
//             "value": "f881B"
//           }
//         ]
//       }
//     ],
//     "score": null,
//     "account_id": 32000011,
//     "labor_cost": null,
//     "_links": {
//       "self": {
//         "href": "https://kommoagendamento.kommo.com/api/v4/leads/19030890?query=f881B&page=1&limit=250"
//       }
//     },
//     "_embedded": {
//       "tags": [],
//       "companies": []
//     }
//   }
// ]

// const leadFilter = leads.filter(lead => lead.custom_fields_values.some(field => field.field_name === 'BK Funnels ID' && field.values[0].value.includes('f881B1')));

// styled.infodir(leadFilter.length);

// function atualizarMensagens(campoDeString, novaMensagem) {
//   // Verifica se o campo já tem mensagens
//   let mensagens = campoDeString ? campoDeString.split('\n') : [];

//   // Adiciona a nova mensagem ao array
//   mensagens.push(novaMensagem);

//   // Mantém apenas as últimas 3 mensagens
//   if (mensagens.length > 3) {
//     mensagens.shift();
//   }

//   // Converte o array de volta para uma string com '\n'
//   return mensagens.join('\n');
// }

// function substituirEmojis(mensagem, textoPadrao = '[emoji]') {
//   // Expressão regular para capturar emojis
//   const regexEmoji = /[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu;

//   // Substituir emojis pelo texto padrão
//   return mensagem.replace(regexEmoji, textoPadrao);
// }

import RecepcaoServices from './src/services/openaiIntegration/RecepcaoServices.js';
import KommoServices from './src/services/kommo/KommoServices.js';
import KommoUtils from './src/utils/KommoUtils.js';
import StaticUtils from './src/utils/StaticUtils.js';
import WebCalendarServices from './src/services/web-calendar/WebCalendarServices.js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import LeadUtils from './src/utils/LeadUtils.js';
import DateUtils from './src/utils/DateUtils.js';

// ADRIANO
// const kommo = new KommoServices({ auth: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjU3MTBhYzI1OGRiYzE5YjMwOGJiOTJjNGQwNWRkNDcyYjAzNTY0MDM5MzUzYTg2OGZmNDU2MGYxM2U3OGRhNDMwNzA1ZTI1MmE5ZDA1ZjkxIn0.eyJhdWQiOiI5OTIzYzhiMi1jNDYzLTQ0MGQtYTcxMS0wMTIwZWZhNGMzYmIiLCJqdGkiOiI1NzEwYWMyNThkYmMxOWIzMDhiYjkyYzRkMDVkZDQ3MmIwMzU2NDAzOTM1M2E4NjhmZjQ1NjBmMTNlNzhkYTQzMDcwNWUyNTJhOWQwNWY5MSIsImlhdCI6MTczNjgxNzQyNSwibmJmIjoxNzM2ODE3NDI1LCJleHAiOjE3Njk4MTc2MDAsInN1YiI6Ijc0MjE4OTkiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MzM5ODExODMsImJhc2VfZG9tYWluIjoia29tbW8uY29tIiwidmVyc2lvbiI6Miwic2NvcGVzIjpbImNybSIsImZpbGVzIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyIsInB1c2hfbm90aWZpY2F0aW9ucyJdLCJoYXNoX3V1aWQiOiJlMzE4MzllYi03MWU1LTQyMDctOGQ0YS1iZWVjZTI3MTg0MTgiLCJhcGlfZG9tYWluIjoiYXBpLWMua29tbW8uY29tIn0.Idtrl_UJp1uHQHfvb8denAWxhASFVY8ju2fZ3hxwmMofCuKXbj8LXPOW92p9XkGgy2azs_IzzprhMjm1yJ_QMtnu71FtfRDE8o55FkfDBeflXH9SaAzhmQ65WmXvpnrwTsrfnbjeCNacPb0m6YQBKezqdS9XtzCw0Ptt_f0Pab7qpLZRuzso7p21zD0HkdGRt5U8ttADaMb-YgKHRnDZKtKEA4BVQWh1R6uvHe2bC4onceyQAiQo_FaKrH1C2w7_kP7ZkfleDhVHLeevjP38qYUeKGsUkfEiyPZgPIFy_MPRfKRnPInDB70K_sbXHjklZ8eQAQgr6Vi2MrOoVFyuwQ', url: 'https://adrianocamposadvogado.kommo.com' });

// DENTAL SANTE
const kommo = new KommoServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
const recepcaoServices = new RecepcaoServices(19030890);

async function test() {
  const response = recepcaoServices.nao_qualificado('YXNzdF9qeDlCWlMxdEJUMHhoRk5jemtSSEVBOTA');
  console.dir(response, { depth: null });
}

test();