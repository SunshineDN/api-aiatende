import axios from 'axios';
import styled from '../../utils/log/styled.js';
import { GetCustomFields } from './GetCustomFields.js';
import { GetContactCustomFields } from './GetContactCustomFields.js';

export const LeadQuery = async (body, data, access_token) => {
  const subdomain = body.account.subdomain;
  let { name, bairro, birthdate, dentist, schedule_date, reason, phone } = data;

  try {
    const options = {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    };

    const custom_fields = await GetCustomFields(body, access_token);
    const contact_custom_fields = await GetContactCustomFields(body, access_token);

    const bairro_field = custom_fields?.filter(field => field.name === 'Bairro')[0];
    const birthdate_field = custom_fields?.filter(field => field.name === 'Data de Nascimento (Texto)')[0];
    const dentist_field = custom_fields?.filter(field => field.name === 'Profissional')[0];
    const schedule_date_field = custom_fields?.filter(field => field.name === 'Data escolhida')[0];
    const reschedule = custom_fields?.filter(field => field.name === 'Reagendou')[0];
    const reason_field = custom_fields?.filter(field => field.name === 'Motivo Consulta')[0];

    const { data: { _embedded } } = await axios.get(`https://${subdomain}.kommo.com/api/v4/contacts?query=${phone}&with=leads`, options);
    const contactFound = _embedded?.contacts;
    if (!contactFound) {

      if (!name || !phone || !schedule_date) {
        throw new Error('Nome, Telefone e Data do Agendamento são obrigatórios!');
      } else {
        styled.info('Lead não encontrado, criando novo lead via agendamento por VOZ...');
        styled.info('Dados do novo lead:', {
          name,
          bairro,
          birthdate,
          dentist,
          schedule_date,
          reason,
          phone
        });

        const params = [  
          {
            'pipeline_id': 9281436,
            'status_id': 72882096,
            'custom_fields_values': [],
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

        if (bairro) {
          params[0].custom_fields_values.push({
            'field_id': bairro_field.id,
            'values': [
              {
                'value': bairro
              }
            ]
          });
        }

        if (birthdate) {
          params[0].custom_fields_values.push({
            'field_id': birthdate_field.id,
            'values': [
              {
                'value': birthdate
              }
            ]
          });
        }

        if (dentist) {
          if (dentist !== 'Dra. Juliana Leite' && dentist !== 'Dra. Anik Calvalcanti' && dentist !== 'Dra. Cícera Milena' && dentist !== 'Dra. Gabriela Perez'
            && dentist !== 'Dra. Iris Leão' && dentist !== 'Dr. Laureano Filho' && dentist !== 'Dra. Liana Mavignier' && dentist !== 'Dra. Luciana Luna'
            && dentist !== 'Dra. Lucília Miranda' && dentist !== 'Dr. Marcus Barbosa' && dentist !== 'Dra. Nashly Rodrigues' && dentist !== 'Dra. Rafaella Karina'
            && dentist !== 'Dra. Renata Cabral' && dentist !== 'Dr. Rafael Fialho') {
            dentist = 'Dentista Isento';
          }

          params[0].custom_fields_values.push({
            'field_id': dentist_field.id,
            'values': [
              {
                'value': dentist
              }
            ]
          });
        }

        if (schedule_date) {
          params[0].custom_fields_values.push({
            'field_id': schedule_date_field.id,
            'values': [
              {
                'value': schedule_date
              }
            ]
          });
        }

        if (reason) {
          if (reason?.includes('Avaliação')) {
            reason = 'Avaliação Geral';
          } else if (reason?.includes('Emergência') || reason?.includes('Urgência')) {
            reason = 'Urgência | Emergência';
          } else if (reason?.includes('Lente') || reason?.includes('Faceta')) {
            reason = 'Lentes | Facetas';
          } else if (reason?.includes('Implante') || reason?.includes('Protocolo')) {
            reason = 'Implantes | Protocolo';
          } else if (reason?.includes('Ortognática')) {
            reason = 'Ortodontia | Ortognática';

          } else {
            reason = 'Consulta Inicial';
          }

          params[0].custom_fields_values.push({
            'field_id': reason_field.id,
            'values': [
              {
                'value': reason
              }
            ]
          });
        }

        await axios.post(`https://${subdomain}.kommo.com/api/v4/leads/complex`, params, options);
        styled.success('Lead criado via agendamento por VOZ com sucesso!');
        return `Usuário cadastrado com sucesso! Segue os dados cadastrados:

Nome: ${name || 'Não informado'}
Bairro: ${bairro || 'Não informado'}
Data de Nascimento: ${birthdate || 'Não informado'}
Dentista: ${dentist || 'Não informado'}
Data do Agendamento: ${schedule_date || 'Não informado'}
Motivo da Consulta: ${reason || 'Não informado'}
Telefone: ${phone}`;
      }
    } else {
      const leadFilterContacts = contactFound?.filter(contact => contact?._embedded?.leads?.length > 0);
      const leadFound = leadFilterContacts[0]?._embedded?.leads[0];
      const lead_id = leadFound?.id;
      const { data: leadObj } = await axios.get(leadFound?._links?.self?.href, options);
      const isSchedule = leadObj?.custom_fields_values?.filter(field => field.field_name === 'Data escolhida')[0]?.values[0]?.value;
      const params = {
        'pipeline_id': 9281436,
        'status_id': 72882096,
        'custom_fields_values': []
      };

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


      if (bairro) {
        params.custom_fields_values.push({
          'field_id': bairro_field.id,
          'values': [
            {
              'value': bairro
            }
          ]
        });
      }

      if (birthdate) {
        params.custom_fields_values.push({
          'field_id': birthdate_field.id,
          'values': [
            {
              'value': birthdate
            }
          ]
        });
      }

      if (dentist) {
        if (dentist !== 'Dra. Juliana Leite' && dentist !== 'Dra. Anik Calvalcanti' && dentist !== 'Dra. Cícera Milena' && dentist !== 'Dra. Gabriela Perez'
          && dentist !== 'Dra. Iris Leão' && dentist !== 'Dr. Laureano Filho' && dentist !== 'Dra. Liana Mavignier' && dentist !== 'Dra. Luciana Luna'
          && dentist !== 'Dra. Lucília Miranda' && dentist !== 'Dr. Marcus Barbosa' && dentist !== 'Dra. Nashly Rodrigues' && dentist !== 'Dra. Rafaella Karina'
          && dentist !== 'Dra. Renata Cabral' && dentist !== 'Dr. Rafael Fialho') {
          dentist = 'Dentista Isento';
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

      if (schedule_date) {
        params.custom_fields_values.push({
          'field_id': schedule_date_field.id,
          'values': [
            {
              'value': schedule_date
            }
          ]
        });
      }

      if (reason) {
        if (reason !== 'Avaliação Geral' && reason !== 'Avaliação Ortodôntica' && reason !== 'Clareamento Dental' && reason !== 'Consulta de Emergência') {
          reason = 'Consulta Inicial';
        }

        params.custom_fields_values.push({
          'field_id': reason_field.id,
          'values': [
            {
              'value': reason
            }
          ]
        });
      }

      if (name) {
        await axios.patch(`https://${subdomain}.kommo.com/api/v4/contacts/${leadFilterContacts[0].id}`, {
          'name': name
        }, options);
      };

      await axios.patch(`https://${subdomain}.kommo.com/api/v4/leads/${lead_id}`, params, options);
      styled.success('Lead atualizado via agendamento por VOZ com sucesso!');
      return `Usuário atualizado com sucesso! Segue os dados atualizados do Lead: *${lead_id}*:

Nome: ${name}
Bairro: ${bairro}
Data de Nascimento: ${birthdate}
Dentista: ${dentist}
Data do Agendamento: ${schedule_date}
Telefone (NÃO MUTÁVEL): ${phone}`;
    }
  } catch (error) {
    styled.error('Erro ao criar / atualizar lead via agendamento por VOZ:', error);
    throw new Error(`Erro ao criar lead: ${error.message}`);
  }
};