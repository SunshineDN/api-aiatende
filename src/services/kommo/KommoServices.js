import axios from "axios";
import KommoUtils from "../../utils/KommoUtils.js";
import StaticUtils from "../../utils/StaticUtils.js";
import styled from "../../utils/log/styledLog.js";
import LeadUtils from "../../utils/LeadUtils.js";
import DateUtils from "../../utils/DateUtils.js";

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

  async getLead({ id, withParams = '' } = {}) {
    let url;
    if (withParams) {
      if (withParams === 'contacts') {
        url = `${this.url}/api/v4/leads/${id}?with=contacts`;

      } else if (withParams === 'catalog_elements') {
        url = `${this.url}/api/v4/leads/${id}?with=catalog_elements`;

      } else if (withParams === 'is_price_modified_by_robot') {
        url = `${this.url}/api/v4/leads/${id}?with=is_price_modified_by_robot`;

      } else if (withParams === 'loss_reason') {
        url = `${this.url}/api/v4/leads/${id}?with=loss_reason`;

      } else if (withParams === 'only_deleted') {
        url = `${this.url}/api/v4/leads/${id}?with=only_deleted`;

      } else if (withParams === 'source_id') {
        url = `${this.url}/api/v4/leads/${id}?with=source_id`;

      } else {
        throw new Error('Invalid withParams');
      }
    } else {
      url = `${this.url}/api/v4/leads/${id}`;
    }

    const options = {
      method: 'GET',
      url,
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      }
    };

    const { data: leadData } = await axios.request(options);

    if (!withParams) {
      return leadData;
    } else {
      if (withParams === 'contacts') {
        leadData.contact = await this.getContact(leadData?._embedded?.contacts?.[0]?.id);
        return leadData;
      } else {
        return leadData;
      }
    }
  }

  async updateLead({ id, status_id = '', pipeline_id = '', custom_fields_values = [] } = {}) {
    const options = {
      method: 'PATCH',
      url: `${this.url}/api/v4/leads/${id}`,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      data: {}
    };

    if (status_id) {
      options.data.status_id = status_id;
    }

    if (pipeline_id) {
      options.data.pipeline_id = pipeline_id;
    }

    if (custom_fields_values.length) {
      options.data.custom_fields_values = custom_fields_values;
    }

    const { data } = await axios.request(options);
    styled.success('[KommoServices.updateLead] - Lead updated');
    return data;
  }

  async getContact(id) {
    const options = {
      method: 'GET',
      url: `${this.url}/api/v4/contacts/${id}`,
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      }
    };

    const { data } = await axios.request(options);
    return data;
  }

  async listLeads({ query = '', first_created = false } = {}) {
    if (query) {
      const options = {
        method: 'GET',
        url: `${this.url}/api/v4/leads?query=${query}`,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${this.auth}`
        }
      };

      const { data: { _embedded: { leads } = {} } = {} } = await axios.request(options);

      if (leads.length > 1) {
        if (first_created) {
          return [leads.sort((a, b) => a.created_at - b.created_at)[0]];
        } else {
          return leads;
        }
      }

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

  async webhookCreate(id, { calendar = false, created_at = false } = {}) {
    const lead = await this.getLead({ id });
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields() });
    const calendario = LeadUtils.findLeadField({ lead, fieldName: 'Calendário', value: true });
    const criacao = LeadUtils.findLeadField({ lead, fieldName: 'Data de Criação', value: true });

    const options = {
      method: 'PATCH',
      url: `${this.url}/api/v4/leads/${id}`,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      data: {
        custom_fields_values: []
      }
    };

    if (calendar) {
      if (!calendario) {
        const calendarField = kommoUtils.findLeadsFieldByName('Calendário');
        const calendarLink = StaticUtils.calendarLink(id);

        options.data.custom_fields_values.push({
          field_id: calendarField.id,
          values: [
            {
              value: calendarLink
            }
          ]
        });
      } else {
        styled.warning('[KommoServices.webhookCreate] - Calendário já existe no Lead');
      }
    }

    if (created_at) {
      if (!criacao) {
        const createdAtField = kommoUtils.findLeadsFieldByName('Data de Criação');
        let createdAt = lead?.created_at;
        if (!createdAt) {
          createdAt = new Date().getTime() / 1000;
        }
        options.data.custom_fields_values.push({
          field_id: createdAtField.id,
          values: [
            {
              value: createdAt
            }
          ]
        });
      } else {
        styled.warning('[KommoServices.webhookCreate] - Data de Criação já existe no Lead');
      }
    }

    const { data } = await axios.request(options);
    styled.success('[KommoServices.webhookCreate] - Webhook Geral de criação de leads executado');
    return { code: 200, response: data };
  }

  async createLeadBk({ name = '', email = '', phone = '', datanascimento = '', dentista = '', procedimento = '', periodo = '', turno = '', code = '' } = {}) {
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields(), contacts_custom_fields: await this.getContactsCustomFields(), pipelines: await this.getPipelines() });

    const phoneField = kommoUtils.findContactsFieldByName('Telefone');
    const emailField = kommoUtils.findContactsFieldByName('O email');

    const nascimentoField = kommoUtils.findLeadsFieldByName('Data de Nascimento');
    const dentistaField = kommoUtils.findLeadsFieldByName('Dentista');
    const procedimentoField = kommoUtils.findLeadsFieldByName('Procedimento');
    const periodoField = kommoUtils.findLeadsFieldByName('Período');
    const turnoField = kommoUtils.findLeadsFieldByName('Turno');
    const codeField = kommoUtils.findLeadsFieldByName('BK Funnels ID');

    const status = kommoUtils.findStatusByName('PRÉ-AGENDAMENTO');

    const options = {
      method: 'POST',
      url: `${this.url}/api/v4/leads/complex`,
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      data: [
        {
          status_id: status.id,
          pipeline_id: status.pipeline_id,
          _embedded: {
            contacts: [
              {
                name: '',
                custom_fields_values: []
              }
            ]
          },
          custom_fields_values: []
        }
      ]
    };

    // Adicionar os elementos ao custom_fields_values se houver algum valor
    if (name) {
      options.data[0]._embedded.contacts[0].name = name;
    }

    if (phone) {
      options.data[0]._embedded.contacts[0].custom_fields_values.push({
        field_id: phoneField.id,
        values: [
          {
            value: kommoUtils.formatPhone(phone),
            enum_code: 'WORK'
          }
        ]
      });
    }

    if (email) {
      options.data[0]._embedded.contacts[0].custom_fields_values.push({
        field_id: emailField.id,
        values: [
          {
            value: email,
            enum_code: 'WORK'
          }
        ]
      });
    }

    if (datanascimento) {
      const validDate = kommoUtils.convertDateToMs(StaticUtils.normalizeDate(datanascimento));
      if (validDate) {
        options.data[0].custom_fields_values.push({
          field_id: nascimentoField.id,
          values: [
            {
              value: validDate
            }
          ]
        });
      }
    }

    if (dentista) {
      options.data[0].custom_fields_values.push({
        field_id: dentistaField.id,
        values: [
          {
            value: dentista
          }
        ]
      });
    }

    if (procedimento) {
      options.data[0].custom_fields_values.push({
        field_id: procedimentoField.id,
        values: [
          {
            value: procedimento
          }
        ]
      });
    }

    if (periodo) {
      options.data[0].custom_fields_values.push({
        field_id: periodoField.id,
        values: [
          {
            value: periodo
          }
        ]
      });
    }

    if (turno) {
      options.data[0].custom_fields_values.push({
        field_id: turnoField.id,
        values: [
          {
            value: turno
          }
        ]
      });
    }

    if (code) {
      options.data[0].custom_fields_values.push({
        field_id: codeField.id,
        values: [
          {
            value: code
          }
        ]
      });
    }

    const { data } = await axios.request(options);
    styled.success('[KommoServices.createLeadBk] - BK Funnels Lead created');
    return { code: 201, response: data };
  };

  async updateLeadBk({ id, datanascimento = '', dentista = '', procedimento = '', periodo = '', turno = '', code = '' } = {}) {
    if (!id) {
      throw new Error('Lead ID is required');
    }

    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields(), contacts_custom_fields: await this.getContactsCustomFields(), pipelines: await this.getPipelines() });

    const nascimentoField = kommoUtils.findLeadsFieldByName('Data de Nascimento');
    const dentistaField = kommoUtils.findLeadsFieldByName('Dentista');
    const procedimentoField = kommoUtils.findLeadsFieldByName('Procedimento');
    const periodoField = kommoUtils.findLeadsFieldByName('Período');
    const turnoField = kommoUtils.findLeadsFieldByName('Turno');
    const codeField = kommoUtils.findLeadsFieldByName('BK Funnels ID');
    
    const status = kommoUtils.findStatusByName('PRÉ-AGENDAMENTO');

    const options = {
      method: 'PATCH',
      url: `${this.url}/api/v4/leads/${id}`,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      data: {
        status_id: status.id,
        pipeline_id: status.pipeline_id,
        custom_fields_values: []
      }
    };

    // Adicionar os elementos ao custom_fields_values se houver algum valor

    if (datanascimento) {
      const validDate = (DateUtils.convertDateToMs(StaticUtils.normalizeDate(datanascimento)) / 1000) + 86400;
      if (validDate) {
        options.data.custom_fields_values.push({
          field_id: nascimentoField.id,
          values: [
            {
              value: validDate
            }
          ]
        });
      }
    }

    if (dentista) {
      options.data.custom_fields_values.push({
        field_id: dentistaField.id,
        values: [
          {
            value: dentista
          }
        ]
      });
    }

    if (procedimento) {
      options.data.custom_fields_values.push({
        field_id: procedimentoField.id,
        values: [
          {
            value: procedimento
          }
        ]
      });
    }

    if (periodo) {
      options.data.custom_fields_values.push({
        field_id: periodoField.id,
        values: [
          {
            value: periodo
          }
        ]
      });
    }

    if (turno) {
      options.data.custom_fields_values.push({
        field_id: turnoField.id,
        values: [
          {
            value: turno
          }
        ]
      });
    }

    if (code) {
      options.data.custom_fields_values.push({
        field_id: codeField.id,
        values: [
          {
            value: code
          }
        ]
      });
    }

    const { data } = await axios.request(options);
    return { code: 200, response: data };
  }
};