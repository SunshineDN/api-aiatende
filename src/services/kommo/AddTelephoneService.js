import styled from '../../utils/log/styledLog.js';
import { FormatTelephone } from '../../utils/FormatTelephone.js';
import { GetContactCustomFields } from './GetContactCustomFields.js';
import { GetUser } from './GetUser.js';
import { UpdateContact } from './UpdateContact.js';
import { HandlingError } from './HandlingError.js';

export const AddTelephoneService = async (payload, access_token) => {
  try {
    const user = await GetUser(payload, true, access_token);
    const contact_custom_fields = await GetContactCustomFields(payload, access_token);
    const contact_id = user?.contact?.id;
    const telephone = user?.custom_fields_values.filter((field) => field.field_name === 'Telefone (Texto)')[0];

    if (!telephone) {
      styled.error('Telefone não encontrado');
      throw new Error('Telefone não encontrado');
    }

    const telephone_field = contact_custom_fields.filter((field) => field.name === 'Phone')[0] || contact_custom_fields.filter((field) => field.name === 'Telefone')[0];
    const enum_telephone = telephone_field?.enums.filter((enum_field) => enum_field.value === 'WORK')[0];

    const telephone_formatted = FormatTelephone(telephone?.values[0].value);

    const reqBody = {
      'custom_fields_values': [
        {
          'field_id': telephone_field?.id,
          'values': [
            {
              'value': telephone_formatted,
              'enum_id': enum_telephone?.id,
              'enum_code': 'WORK'
            }
          ]
        }
      ]
    };
    // console.log('Requisição para adicionar telefone no contato ' + contact_id + ':');
    // console.dir(reqBody, { depth: null });

    await UpdateContact(payload, contact_id, reqBody, access_token);
    // console.log('Telefone adicionado com sucesso!');
    return;
  } catch (error) {
    styled.error('Erro ao adicionar telefone ao contato do lead:', error);
    if (error.response) {
      await HandlingError(payload, access_token, `Erro ao adiciontar telefone ao contato do lead: ${error.response.data}`);
    } else {
      await HandlingError(payload, access_token, `Erro ao adiciontar telefone ao contato do lead: ${error.message}`);
    }
    throw new Error('Erro no AddTelephoneService');

  };
};