const axios = require('axios');
const GetCustomFields = require('./GetCustomFields');
const GetContactCustomFields = require('./GetContactCustomFields');

const LeadQuery = async (body, data, access_token) => {
  const subdomain = body.account.subdomain;
  let { name, bairro, birthdate, dentist, schedule_date, phone } = data;

  try {
    const options = {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    };

    const { data: { _embedded } } = await axios.get(`https://${subdomain}.kommo.com/api/v4/leads?query=${phone}&with=contacts`, options);
    const leadFound = _embedded?.leads;
    if (!leadFound) {
      console.log('Lead não encontrado, criando novo lead via agendamento por VOZ...');
      const custom_fields = await GetCustomFields(body, access_token);
      const contact_custom_fields = await GetContactCustomFields(body, access_token);
      const bairro_field = custom_fields?.filter(field => field.name === 'Bairro')[0];
      const birthdate_field = custom_fields?.filter(field => field.name === 'Data de Nascimento (Texto)')[0];
      const dentist_field = custom_fields?.filter(field => field.name === 'Dentista')[0];
      const schedule_date_field = custom_fields?.filter(field => field.name === 'Data escolhida')[0];

      console.log('Dados do novo lead:', {
        name,
        bairro,
        birthdate,
        dentist,
        schedule_date,
        phone
      });

      if (dentist !== 'Dra. Juliana Leite' && dentist !== 'Dra. Anik Calvalcanti' && dentist !== 'Dra. Cícera Milena' && dentist !== 'Dra. Gabriela Perez'
        && dentist !== 'Dra. Iris Leão' && dentist !== 'Dr. Laureano Filho' && dentist !== 'Dra. Liana Mavignier' && dentist !== 'Dra. Luciana Luna'
        && dentist !== 'Dra. Lucília Miranda' && dentist !== 'Dr. Marcus Barbosa' && dentist !== 'Dra. Nashly Rodrigues' && dentist !== 'Dra. Rafaella Karina'
        && dentist !== 'Dra. Renata Cabral' && dentist !== 'Dr. Rafael Fialho') {
        dentist = 'Dentista Isento'
      }

      const params = [
        {
          'pipeline_id': 9281436,
          'status_id': 72882096,
          'custom_fields_values': [
            {
              'field_id': bairro_field?.id,
              'values': [
                {
                  'value': bairro
                }
              ]
            },
            {
              'field_id': birthdate_field?.id,
              'values': [
                {
                  'value': birthdate
                }
              ]
            },
            {
              'field_id': dentist_field?.id,
              'values': [
                {
                  'value': dentist
                }
              ]
            },
            {
              'field_id': schedule_date_field?.id,
              'values': [
                {
                  'value': schedule_date
                }
              ]
            }
          ],
          '_embedded': {
            'contacts': [
              {
                'name': name,
                'custom_fields_values': [
                  {
                    'field_id': contact_custom_fields?.filter(field => field.name === 'Telefone' || field.name === 'Phone')[0]?.id,
                    'values': [
                      {
                        'value': phone,
                        'enum_id': 778606,
                        'enum_code': 'WORK'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      ];

      await axios.post(`https://${subdomain}.kommo.com/api/v4/leads/complex`, params, options);
      console.log('Lead criado via agendamento por VOZ com sucesso!');
      return;
    } else {
      const lead_id = leadFound[0]?.id || leadFound?.id;
      const isSchedule = leadFound[0]?.custom_fields_values?.filter(field => field.field_name === 'Data escolhida')[0]?.values[0]?.value;
      const custom_fields = await GetCustomFields(body, access_token);
      const params = {
        'pipeline_id': 9281436,
        'status_id': 72882096,
        'custom_fields_values': []
      };

      const bairro_field = custom_fields?.filter(field => field.name === 'Bairro')[0];
      const birthdate_field = custom_fields?.filter(field => field.name === 'Data de Nascimento (Texto)')[0];
      const dentist_field = custom_fields?.filter(field => field.name === 'Dentista')[0];
      const schedule_date_field = custom_fields?.filter(field => field.name === 'Data escolhida')[0];
      const reschedule = custom_fields?.filter(field => field.name === 'Reagendou')[0];

      if (isSchedule) {
        params.pipeline_id = 7760035,
        params.status_id = 75226020;
        params.custom_fields_values.push({
          'field_id': reschedule.id,
          'values': [
            {
              'value': true
            }
          ]
        });
      }


      if (bairro_field) {
        params.custom_fields_values.push({
          'field_id': bairro_field.id,
          'values': [
            {
              'value': bairro
            }
          ]
        });
      }

      if (birthdate_field) {
        params.custom_fields_values.push({
          'field_id': birthdate_field.id,
          'values': [
            {
              'value': birthdate
            }
          ]
        });
      }

      if (dentist_field) {
        if (dentist !== 'Dra. Juliana Leite' && dentist !== 'Dra. Anik Calvalcanti' && dentist !== 'Dra. Cícera Milena' && dentist !== 'Dra. Gabriela Perez'
          && dentist !== 'Dra. Iris Leão' && dentist !== 'Dr. Laureano Filho' && dentist !== 'Dra. Liana Mavignier' && dentist !== 'Dra. Luciana Luna'
          && dentist !== 'Dra. Lucília Miranda' && dentist !== 'Dr. Marcus Barbosa' && dentist !== 'Dra. Nashly Rodrigues' && dentist !== 'Dra. Rafaella Karina'
          && dentist !== 'Dra. Renata Cabral' && dentist !== 'Dr. Rafael Fialho') {
          dentist = 'Dentista Isento'
        }

        params.custom_fields_values.push({
          'field_id': dentist_field.id,
          'values': [
            {
              'value': dentist
            }
          ]
        });
      }

      if (schedule_date_field) {
        params.custom_fields_values.push({
          'field_id': schedule_date_field.id,
          'values': [
            {
              'value': schedule_date
            }
          ]
        });
      }

      await axios.patch(`https://${subdomain}.kommo.com/api/v4/leads/${lead_id}`, params, options);
      console.log('Lead atualizado via agendamento por VOZ com sucesso!');
      return;
    }
  } catch (error) {
    console.log('Erro ao criar / atualizar lead via agendamento por VOZ:', error);
    throw new Error(`Erro ao criar lead: ${error.message}`);
  }
};

module.exports = LeadQuery;
