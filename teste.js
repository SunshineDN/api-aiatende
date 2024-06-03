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

const dataHoraBrasil = new Date('06-03-2024');
const dataHoraUtc = new Date(dataHoraBrasil.getTime() + (dataHoraBrasil.getTimezoneOffset() * 60000));
const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const weekDay = weekDays[dataHoraUtc.getDay()];
console.log(weekDay);
