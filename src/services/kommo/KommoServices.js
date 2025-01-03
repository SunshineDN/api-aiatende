import axios from "axios";
import KommoUtils from "../../utils/KommoUtils.js";

export default class KommoServices {
  constructor({ auth, url }) {
    this.auth = auth;
    this.url = url;
  }

  checkAuth() {
    return {
      auth: this.auth,
      url: this.url
    }
  }

  async listLeads({ query = '' } = {}) {
    if (query) {
      const options = {
        method: 'GET',
        url: `${this.url}/api/v4/leads?query=${query}`,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${this.auth}`
        }
      };

      const { data: { _embedded: { leads } } } = await axios.request(options);
      return leads;
    }

    return [];
  }

  async getContactsCustomFields() {
    const options = {
      method: 'GET',
      url: `${this.url}/api/v4/contacts/custom_fields`,
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      }
    };

    const { data: { _embedded: { custom_fields } } } = await axios.request(options);
    return custom_fields;
  }

  async getLeadsCustomFields() {
    const options = {
      method: 'GET',
      url: `${this.url}/api/v4/leads/custom_fields`,
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      }
    };

    const { data: { _embedded: { custom_fields } } } = await axios.request(options);
    return custom_fields;
  }

  async getPipelines() {
    const options = {
      method: 'GET',
      url: `${this.url}/api/v4/leads/pipelines`,
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      }
    };

    const { data: { _embedded: { pipelines } } } = await axios.request(options);
    return pipelines;
  }

  async createLeadBk({ name = '', email = '', phone = '', datanascimento = '', dentista = '', procedimento = '', periodo = '', turno = '', code = '' }) {
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields(), contacts_custom_fields: await this.getContactsCustomFields(), pipelines: await this.getPipelines() });

    const phoneField = kommoUtils.findContactsFieldByName('Telefone');
    const emailField = kommoUtils.findContactsFieldByName('O email');

    const nascimentoField = kommoUtils.findLeadsFieldByName('Data de Nascimento');
    const dentistaField = kommoUtils.findLeadsFieldByName('Dentista');
    const procedimentoField = kommoUtils.findLeadsFieldByName('Procedimento');
    const periodoField = kommoUtils.findLeadsFieldByName('Período');
    const turnoField = kommoUtils.findLeadsFieldByName('Turno');
    const codeField = kommoUtils.findLeadsFieldByName('BK Funnels ID');

    const status = kommoUtils.findStatusByName('BK FUNNELS');

    const options = {
      method: 'POST',
      url: `${this.url}/api/v4/leads/complex`,
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      data: [
        {
          field_id: status.id,
          pipeline_id: status.pipeline_id,
          _embedded: {
            contacts: [
              {
                name: name,
                custom_fields_values: [
                  {
                    field_id: phoneField.id,
                    value: phone
                  },
                  {
                    field_id: emailField.id,
                    value: email
                  }
                ]
              }
            ]
          },
          custom_fields_values: [
            {
              field_id: nascimentoField.id,
              value: kommoUtils.convertDateToMs(datanascimento)
            },
            {
              field_id: dentistaField.id,
              value: dentista
            },
            {
              field_id: procedimentoField.id,
              value: procedimento
            },
            {
              field_id: periodoField.id,
              value: periodo
            },
            {
              field_id: turnoField.id,
              value: turno
            },
            {
              field_id: codeField.id,
              value: code
            }
          ]
        }
      ]
    };
  };
};