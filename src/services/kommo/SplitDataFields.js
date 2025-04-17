import styled from '../../utils/log/styled.js';
import { GetAccessToken } from './GetAccessToken.js';
import { GetCustomFields } from './GetCustomFields.js';
import { GetUser } from './GetUser.js';
import { HandlingError } from './HandlingError.js';
import { UpdateLead } from './UpdateLead.js';

export const SplitDataFields = async (payload, access_token = null) => {
  // REQUISICAO PARA O KOMMO
  try {
    // console.log('Função SplitDataFields');
    if (!access_token) {
      access_token = GetAccessToken()
    }
    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    const dataField = user?.custom_fields_values?.filter(field => field.field_name === 'Registration Data')[0];
    const dataFieldValues = dataField?.values[0]?.value;
    const data_field_split = dataFieldValues.split(';');
    const fields_names = data_field_split.map((_, index) => `Field ${index + 1}`);
    const findField = (name) => custom_fields.filter(field => field.name === name)[0];
    let custom_fields_values = [];
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
    // console.log('Split Data Fields finalizado com sucesso!');
    return;
  } catch (error) {
    styled.error('Erro no SplitDataFields:', error);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao dividir o campo de dados: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao dividir o campo de dados: ${error.message}`);
    }
    throw new Error('Erro no SplitDataFields');
  }
};