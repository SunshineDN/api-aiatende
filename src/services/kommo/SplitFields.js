const GetAccessToken = require('./GetAccessToken');
const GetCustomFields = require('./GetCustomFields');
const GetUser = require('./GetUser');
const UpdateLead = require('./UpdateLead');

const SplitFields = async (payload, access_token = null) => {
  // REQUISICAO PARA O KOMMO
  try {
    console.log('Função SplitFields');
    console.log('Usuário:', user);

    if (!access_token) {
      access_token = await GetAccessToken(payload);
    }

    const user = await GetUser(payload, false, access_token);
    const custom_fields = await GetCustomFields(payload, access_token);

    const fatherField = user?.custom_fields_values?.filter(field => field.field_name === 'Pai')[0];
    const fatherFieldValues = fatherField?.values[0]?.value;

    const sonField1 = custom_fields.filter(field => field.name === 'Nome Completo')[0];
    const sonField2 = custom_fields.filter(field => field.name === 'Data Nascimento (Texto)')[0];
    const sonField3 = custom_fields.filter(field => field.name === 'Bairro')[0];
    const returnFatherField = custom_fields.filter(field => field.name === 'Retorno Pai')[0];
    const all_data_filled = custom_fields.filter(field => field.name === 'All Data Filled')[0];

    console.log('Campo Pai:', fatherField?.values[0]?.value);

    const [son1, son2, son3] = fatherFieldValues.split(';');

    console.log('Filho 1:', son1);
    console.log('Filho 2:', son2);
    console.log('Filho 3:', son3);

    console.log('Requisição para o Kommo');
    console.log('ID do Lead:', payload.lead_id);
    console.log('Campo Pai:', fatherField);
    console.log('Campo Filho 1:', sonField1);
    console.log('Campo Filho 2:', sonField2);
    console.log('Campo Filho 3:', sonField3);

    console.log('ID do Campo Filho 1:', sonField1?.id);
    console.log('ID do Campo Filho 2:', sonField2?.id);
    console.log('ID do Campo Filho 3:', sonField3?.id);

    const bodyReq = {
      'custom_fields_values': [
        {
          'field_id': sonField1?.id,
          'values': [
            {
              'value': son1
            }
          ]
        },
        {
          'field_id': sonField2?.id,
          'values': [
            {
              'value': son2
            }
          ]
        },
        {
          'field_id': sonField3?.id,
          'values': [
            {
              'value': son3
            }
          ]
        },
        {
          'field_id': returnFatherField?.id,
          'values': [
            {
              'value': true
            }
          ]
        },
      ]
    };

    if (son1 && son2 && son3) {
      bodyReq.custom_fields_values.push({
        'field_id': all_data_filled?.id,
        'values': [
          {
            'value': true
          }
        ]
      });
    } else {
      bodyReq.custom_fields_values.push({
        'field_id': all_data_filled?.id,
        'values': [
          {
            'value': false
          }
        ]
      });
    
    }

    await UpdateLead(payload, bodyReq, access_token);
  } catch (err) {
    console.log('Erro na função SplitFields');
    throw new Error(err);
  }
};

module.exports = SplitFields;
