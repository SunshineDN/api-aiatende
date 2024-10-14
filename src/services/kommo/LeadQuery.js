const axios = require('axios');
const GetCustomFields = require('./GetCustomFields');
const GetContactCustomFields = require('./GetContactCustomFields');

const LeadQuery = async (body, data, access_token) => {
  const subdomain = body.account.subdomain;
  const { name, bairro, birthdate, dentist, schedule_date, phone } = data;
  const options = {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  };
  const leadFound = await axios.get(`https://${subdomain}.kommo.com/api/v4/leads?query=${phone}&with=contacts`, options);
  if (!leadFound) {
    const custom_fields = await GetCustomFields(body, access_token);
    const contact_custom_fields = await GetContactCustomFields(body, access_token);
    const bairro_field = custom_fields?.filter(field => field.name === 'Bairro')[0];
    const birthdate_field = custom_fields?.filter(field => field.name === 'Data de Nascimento (Texto)')[0];
    const dentist_field = custom_fields?.filter(field => field.name === 'Dentista')[0];
    const schedule_date_field = custom_fields?.filter(field => field.name === 'Data escolhida')[0];

    const params = {
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
                    'enum_code': 'WORK'
                  }
                ]
              }
            ]
          }
        ]
      },
      'pipeline_id': 9281436,
      'status_id': 72882096
    };

    await axios.post(`https://${subdomain}.kommo.com/api/v4/leads/complex`, params, options);
    return;
  } else {
    const lead_id = leadFound.data.data[0].id;
    const 
  }
};
