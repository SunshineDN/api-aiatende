const GetAccessToken = require('./GetAccessToken');
const GetCustomFields = require('./GetCustomFields');
const GetUser = require('./GetUser');
const HandlingError = require('./HandlingError');
const UpdateLead = require('./UpdateLead');
const styled = require('../../utils/log/styledLog');
const DateUtils = require('../../utils/DateUtils');

const SplitSchedulingFields = async (payload, access_token = null) => {
  // REQUISICAO PARA O KOMMO
  try {
    // console.log('Função SplitSchedulingFields');
    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }
    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    const dataField = user?.custom_fields_values?.filter(field => field.field_name === 'Registration Data')[0];
    const dataFieldValues = dataField?.values[0]?.value;
    const data_field_split_symbol = dataFieldValues.split('; ');
    const data_field_split = data_field_split_symbol.map((value) => value.replace(';', ''));
    const fields_names = data_field_split.map((_, index) => `Scheduling field ${index + 1}`);
    let custom_fields_values = [];

    if (data_field_split.length >= 3) {
      const birth = String(data_field_split[1]);
      const birthField = custom_fields.filter(field => field.name === 'Data de Nascimento')[0];
      const birthMs = DateUtils.formatDateToMs(birth);
      const birthTime = Math.round(birthMs / 1000);

      const neighbor = data_field_split[2];
      const neighborField = custom_fields.filter(field => field.name === 'Bairro')[0];
      const neighbor_lower = neighbor.toLowerCase();
      let neighborhood = '';

      if (neighbor_lower.includes('candeias')) {
        neighborhood = 'Candeias';
      } else if (neighbor_lower.includes('boa viagem')) {
        neighborhood = 'Boa Viagem';
      } else if (neighbor_lower.includes('piedade')) {
        neighborhood = 'Piedade';
      } else if (neighbor_lower.includes('barra de jangada')) {
        neighborhood = 'Barra de Jangada';
      } else if (neighbor_lower.includes('prazeres')) {
        neighborhood = 'Prazeres';
      } else if (neighbor_lower.includes('paiva')) {
        neighborhood = 'Paiva';
      } else if (neighbor_lower.includes('imbiribeira')) {
        neighborhood = 'Imbiribeira';
      } else if (neighbor_lower.includes('setubal')) {
        neighborhood = 'Setubal';
      } else {
        neighborhood = 'Outro';
      }

      custom_fields_values.push({
        'field_id': birthField.id,
        'values': [
          {
            'value': birthTime
          }
        ]
      },
      {
        'field_id': neighborField.id,
        'values': [
          {
            'value': neighborhood
          }
        ]
      });
    }

    const findField = (name) => custom_fields.filter(field => field.name === name)[0];
    data_field_split.forEach((value, index) => {
      const field = findField(fields_names[index]);
      if (!field) {
        return;
      }
      custom_fields_values.push({
        'field_id': field.id,
        'values': [
          {
            'value': value
          }
        ]
      });
    });
    const returnDataField = custom_fields.filter(field => field.name === 'Return Data')[0];
    custom_fields_values.push({
      'field_id': returnDataField?.id,
      'values': [
        {
          'value': true
        }
      ]
    });
    const all_data_filled = custom_fields.filter(field => field.name === 'All Data Filled')[0];
    if (custom_fields_values.length - 1 === data_field_split.length) {
      // console.log('Todos os campos do pai existem no array de custom_fields');
      custom_fields_values.push({
        'field_id': all_data_filled?.id,
        'values': [
          {
            'value': true
          }
        ]
      });
    } else {
      // console.log('Alguns campos do pai não existem no array de custom_fields');
      custom_fields_values.push({
        'field_id': all_data_filled?.id,
        'values': [
          {
            'value': false
          }
        ]
      });
    }
    // const sonField1 = custom_fields.filter(field => field.name === 'Nome Completo')[0];
    // const sonField2 = custom_fields.filter(field => field.name === 'Data Nascimento (Texto)')[0];
    // const sonField3 = custom_fields.filter(field => field.name === 'Bairro')[0];
    // console.log('Campo Pai:', dataFieldValues);
    // const [son1, son2, son3] = dataFieldValues.split(';');
    // console.log('Filho 1:', son1);
    // console.log('Filho 2:', son2);
    // console.log('Filho 3:', son3);
    // console.log('Requisição para o Kommo');
    // console.log('ID do Lead:', payload.lead_id);
    // console.log('Campo Pai:', dataField);
    // console.log('Campo Filho 1:', sonField1);
    // console.log('Campo Filho 2:', sonField2);
    // console.log('Campo Filho 3:', sonField3);
    // console.log('ID do Campo Filho 1:', sonField1?.id);
    // console.log('ID do Campo Filho 2:', sonField2?.id);
    // console.log('ID do Campo Filho 3:', sonField3?.id);
    const bodyReq = {
      'custom_fields_values': custom_fields_values
    };
    // if (son1 && son2 && son3) {
    //   bodyReq.custom_fields_values.push({
    //     'field_id': all_data_filled?.id,
    //     'values': [
    //       {
    //         'value': true
    //       }
    //     ]
    //   });
    // } else {
    //   bodyReq.custom_fields_values.push({
    //     'field_id': all_data_filled?.id,
    //     'values': [
    //       {
    //         'value': false
    //       }
    //     ]
    //   });
    // }
    await UpdateLead(payload, bodyReq, access_token);
    // console.log('Split Shceduling Fields finalizado com sucesso!');
    return;
  } catch (error) {
    styled.error('Erro ao dividir campo de dados de agendamento:', error);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao dividir campo de dados de agendamento: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao dividir campo de dados de agendamento: ${error.message}`);
    }
    throw new Error('Erro no SplitSchedulingFields');
  }
};

module.exports = SplitSchedulingFields;
