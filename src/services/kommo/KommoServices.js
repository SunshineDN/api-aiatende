import axios from "axios";
import KommoUtils from "../../utils/KommoUtils.js";
import StaticUtils from "../../utils/StaticUtils.js";
import styled from "../../utils/log/styled.js";
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

  async createLead({pipeline_id = '', status_id = '', custom_fields_values = []} = {}) {

    const options = {
      method: 'POST',
      url: `${this.url}/api/v4/leads`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${this.auth}`
      },
      data: [
        {
          pipeline_id,
          status_id,
          custom_fields_values
        }
      ]
    };
    
    const { data } = await axios.request(options);
    styled.success('[KommoServices.createLead] - Lead created');
    return data;
  }

  async updateLead({ id, status_id = '', pipeline_id = '', custom_fields_values = [] } = {}) {
    if (!id) {
      throw new Error('Lead ID is required');
    }

    if (!status_id && !pipeline_id && custom_fields_values.length === 0) {
      throw new Error('No data to update lead');
    }

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

  /**
   * Método para atualizar o contato do lead
   * @param {object} objeto de atualização do contato
   * @param {string} objeto.id ID do contato
   * @param {string} objeto.name Nome do contato
   * @param {string} objeto.email Email do contato
   * @param {string} objeto.phone Telefone do contato
   * @param {array} objeto.custom_fields_values Campos customizados do contato
   * 
   * @returns {Promise<object>} Retorna o contato atualizado
   */
  async updateContact({ id, name = '', email = '', phone = '', custom_fields_values = [] } = {}) {
    if (!id) {
      throw new Error('Contact ID is required');
    }

    if (!name && !email && !phone && custom_fields_values.length === 0) {
      throw new Error('No data to update contact');
    }

    const options = {
      method: 'PATCH',
      url: `${this.url}/api/v4/contacts/${id}`,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      data: {
        custom_fields_values: []
      }
    };

    if (custom_fields_values.length) {
      options.data.custom_fields_values = custom_fields_values;
    }

    if (name) {
      options.data.name = name;
    }

    if (email || phone) {
      const kommoUtils = new KommoUtils({ contacts_custom_fields: await this.getContactsCustomFields() });

      if (email) {
        const emailField = kommoUtils.findContactsFieldByCode('EMAIL') || kommoUtils.findContactsFieldByName('Email');
        options.data.custom_fields_values.push({
          field_id: emailField.id,
          values: [
            {
              value: email,
              enum_code: 'WORK'
            }
          ]
        });
      }

      if (phone) {
        const phoneField = kommoUtils.findContactsFieldByCode('PHONE') || kommoUtils.findContactsFieldByName('Telefone');
        options.data.custom_fields_values.push({
          field_id: phoneField.id,
          values: [
            {
              value: kommoUtils.formatPhone(phone),
              enum_code: 'WORK'
            }
          ]
        });
      }
    }

    const { data } = await axios.request(options);
    styled.success('[KommoServices.updateContact] - Contact updated');
    return data;
  }

  async listLeads({ query = '', first_created = false, withParams = '' } = {}) {
    if (query) {
      const url = withParams !== '' ? `${this.url}/api/v4/leads?query=${query}&with=${withParams}` : `${this.url}/api/v4/leads?query=${query}`;
      const options = {
        method: 'GET',
        url,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${this.auth}`
        }
      };

      const { data: { _embedded: { leads } = {} } = {}, status } = await axios.request(options);

      if (status === 204) {
        return [];
      }

      if (leads?.length > 1) {
        if (first_created) {
          const lead = leads.sort((a, b) => a.created_at - b.created_at)[0];
          if (withParams === 'contacts') {
            lead.contact = await this.getContact(lead?._embedded?.contacts?.[0]?.id);
          }
          return lead;
        } else {
          return leads;
        }
      } else {
        if (first_created) {
          const lead = leads[0];
          if (withParams === 'contacts') {
            lead.contact = await this.getContact(lead?._embedded?.contacts?.[0]?.id);
          }
          return lead;
        } else {
          return leads;
        }
      }
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

  /**
   * Método para lançar um bot no lead
   * @param {number} id - ID do lead
   * @param {number} bot_id - ID do bot
   * @returns {Promise<object>} Retorna o bot lançado
   */
  async launchBot(id, bot_id) {
    const options = {
      method: 'POST',
      url: `${this.url}/api/v2/salesbot/run`,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      data: [
        {
          entity_type: '2',
          entity_id: id,
          bot_id
        }
      ]
    }

    const { data } = await axios.request(options);
    styled.success('[KommoServices.launchBot] - Bot launched');

    return { code: 200, response: data };
  }


  /**
   * Método para criar um lead no BK Funnels
   * @param {object} objeto de criação do lead
   * @param {string} objeto.name Nome do lead
   * @param {string} objeto.email Email do lead
   * @param {string} objeto.bairro Bairro do lead
   * @param {string} objeto.phone Telefone do lead
   * @param {string} objeto.datanascimento Data de nascimento do lead
   * @param {string} objeto.dentista Dentista do lead
   * @param {string} objeto.service Serviço do lead
   * @param {string} objeto.periodo Período do lead
   * @param {string} objeto.turno Turno do lead
   * @param {string} objeto.code Código do lead
   * @param {string} objeto.lead_status Status do lead
   * 
   * @returns {Promise<object>} Retorna o lead criado
   */
  async createLeadBk({ name = '', email = '', bairro = '', phone = '', datanascimento = '', dentista = '', service = '', periodo = '', turno = '', code = '', lead_status = '' } = {}) {
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields(), contacts_custom_fields: await this.getContactsCustomFields(), pipelines: await this.getPipelines() });

    const phoneField = kommoUtils.findContactsFieldByName('Telefone') || kommoUtils.findContactsFieldByName('Phone');
    const emailField = kommoUtils.findContactsFieldByName('O email') || kommoUtils.findContactsFieldByName('Email');

    const bairroField = kommoUtils.findLeadsFieldByName('Bairro');
    const nascimentoField = kommoUtils.findLeadsFieldByName('Data de Nascimento');
    const dentistaField = kommoUtils.findLeadsFieldByName('Profissional');
    const serviceField = kommoUtils.findLeadsFieldByName('Serviço');
    const periodoField = kommoUtils.findLeadsFieldByName('Período');
    const turnoField = kommoUtils.findLeadsFieldByName('Turno');
    const codeField = kommoUtils.findLeadsFieldByName('BK Funnels ID');

    const status = kommoUtils.findStatusByName(lead_status || 'DADOS CADASTRAIS');

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

    if (bairro) {
      options.data[0].custom_fields_values.push({
        field_id: bairroField.id,
        values: [
          {
            value: bairro
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

    if (service) {
      options.data[0].custom_fields_values.push({
        field_id: serviceField.id,
        values: [
          {
            value: service
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

    const calendarioField = kommoUtils.findLeadsFieldByName('Calendário');

    const custom_fields_values = [
      {
        field_id: calendarioField.id,
        values: [
          {
            value: StaticUtils.calendarLink(data[0].id)
          }
        ]
      }
    ];

    await this.updateLead({ id: data[0].id, custom_fields_values });

    return { code: 201, response: data };
  };

  /**
   * Método para atualizar o lead do BK Funnels
   * @param {object} objeto de atualização do lead
   * @param {string} objeto.id ID do lead
   * @param {string} objeto.name Nome do lead
   * @param {string} objeto.email Email do lead
   * @param {string} objeto.bairro Bairro do lead
   * @param {string} objeto.datanascimento Data de nascimento do lead
   * @param {string} objeto.dentista Dentista do lead
   * @param {string} objeto.service Serviço do lead
   * @param {string} objeto.periodo Período do lead
   * @param {string} objeto.turno Turno do lead
   * @param {string} objeto.code Código do lead
   * @param {string} objeto.lead_status Status do lead
   * 
   * @returns {Promise<object>} Retorna o lead atualizado
   */
  async updateLeadBk({ id, name = '', email = '', bairro = '', datanascimento = '', dentista = '', service = '', periodo = '', turno = '', code = '', lead_status = '' } = {}) {
    if (!id) {
      throw new Error('Lead ID is required');
    }

    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields(), contacts_custom_fields: await this.getContactsCustomFields(), pipelines: await this.getPipelines() });

    const bairroField = kommoUtils.findLeadsFieldByName('Bairro');
    const nascimentoField = kommoUtils.findLeadsFieldByName('Data de Nascimento');
    const dentistaField = kommoUtils.findLeadsFieldByName('Profissional');
    const serviceField = kommoUtils.findLeadsFieldByName('Serviço');
    const periodoField = kommoUtils.findLeadsFieldByName('Período');
    const turnoField = kommoUtils.findLeadsFieldByName('Turno');
    const codeField = kommoUtils.findLeadsFieldByName('BK Funnels ID');
    const calendarioField = kommoUtils.findLeadsFieldByName('Calendário');

    const status = kommoUtils.findStatusByName(lead_status || 'PRÉ-AGENDAMENTO');

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
        custom_fields_values: [
          {
            field_id: calendarioField.id,
            values: [
              {
                value: StaticUtils.calendarLink(id)
              }
            ]
          }
        ]
      }
    };

    // Adicionar os elementos ao custom_fields_values se houver algum valor

    if (bairro) {
      options.data.custom_fields_values.push({
        field_id: bairroField.id,
        values: [
          {
            value: bairro
          }
        ]
      });
    }

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

    if (service) {
      options.data.custom_fields_values.push({
        field_id: serviceField.id,
        values: [
          {
            value: service
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
    let response = {};

    const { data: update_lead } = await axios.request(options);
    response.lead = update_lead;

    let update_contact;
    if (name || email) {
      const lead = await this.getLead({ id, withParams: 'contacts' });
      const contact_id = lead.contact.id;
      const contact_upd_obj = {}

      if (name) {
        contact_upd_obj.name = name;
      }

      if (email) {
        contact_upd_obj.email = email;
      }

      update_contact = await this.updateContact({ ...contact_upd_obj, id: contact_id });
    }
    response.contact = update_contact;

    return { code: 200, response };
  }
};