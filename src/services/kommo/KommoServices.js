import axios from "axios";
import KommoUtils from "../../utils/KommoUtils.js";
import StaticUtils from "../../utils/StaticUtils.js";
import styled from "../../utils/log/styled.js";
import LeadRepository from "../../repositories/LeadRepository.js";
import DateUtils from "../../utils/DateUtils.js";

export default class KommoServices {
  #leadRepository;

  constructor({ auth, url }) {
    this.auth = auth;
    this.url = url;
    this.#leadRepository = new LeadRepository();
  }

  checkAuth() {
    return {
      auth: this.auth,
      url: this.url
    }
  }

  /**
   * Método para buscar um lead pelo ID, com opções para trazer informações adicionais como contatos, elementos de catálogo, razão de perda, etc.
   * 
   * @param {object} object
   * @param {string} object.id ID do lead
   * @param {string} object.withParams Parâmetro para trazer informações adicionais do lead
   * @returns {Promise<object>} Retorna os dados do lead
   */
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
      await this.#leadRepository.findCreateAndUpdate(id, leadData);
      return leadData;
    } else {
      if (withParams === 'contacts') {
        leadData.contact = await this.getContact(leadData?._embedded?.contacts?.[0]?.id);
        await this.#leadRepository.findCreateAndUpdate(id, leadData);
        return leadData;
      } else {
        await this.#leadRepository.findCreateAndUpdate(id, leadData);
        return leadData;
      }
    }
  }

  /**
   * Método para criar um lead
   * @param {object} objeto de criação do lead
   * @param {string} objeto.pipeline_id ID do pipeline
   * @param {string} objeto.status_id ID do status
   * @param {array} objeto.custom_fields_values Campos customizados do lead
   * 
   * @returns {Promise<object>} Retorna o lead criado
   */
  async createLead({ pipeline_id = '', status_id = '', custom_fields_values = [] } = {}) {

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

  /**
   * Método para atualizar um lead
   * 
   * @param {object} objeto de atualização do lead
   * @param {string} objeto.id ID do lead
   * @param {string} [objeto.status_id] ID do status
   * @param {string} [objeto.pipeline_id] ID do pipeline
   * @param {number} [objeto.responsible_user_id] ID do usuário responsável pelo lead
   * @param {array} [objeto.custom_fields_values] Campos customizados do lead
   * @returns {Promise<object>} Retorna o lead atualizado
   */
  async updateLead({ id, status_id = '', pipeline_id = '', responsible_user_id = 0, custom_fields_values = [] } = {}) {
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

    if (responsible_user_id) {
      options.data.responsible_user_id = responsible_user_id;
    }

    if (custom_fields_values.length) {
      options.data.custom_fields_values = custom_fields_values;
    }

    const { data } = await axios.request(options);
    styled.success('[KommoServices.updateLead] - Lead updated');
    return data;
  }

  /**
   * Método para buscar um contato pelo ID
   * 
   * @param {string} id ID do contato
   * @returns {Promise<object>} Retorna os dados do contato
   *
   */
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

  /**
   * Método para atualizar o lead e o contato do lead
   * @param {object} objeto de atualização do lead
   * @param {string} [objeto.id] ID do lead
   * @param {string} [objeto.name] Nome do lead
   * @param {string} [objeto.email] Email do lead
   * @param {string} [objeto.phone] Telefone do lead
   * @param {string} [objeto.phoneCode] Código do campo do Telefone
   * @param {array} [objeto.lead_custom_fields_values] Campos customizados do lead
   * @param {array} [objeto.contact_custom_fields_values] Campos customizados do contato
   * @returns {Promise<object>} Retorna o lead atualizado e o contato atualizado
   */
  async updateLeadComplex({ id, status_id = '', pipeline_id = '', name = '', email = '', emailCode = '', phone = '', phoneCode = '', lead_custom_fields_values = [], contact_custom_fields_values = [] } = {}) {
    if (!id) {
      throw new Error('Lead ID is required');
    }

    const lead = await this.getLead({ id, withParams: 'contacts' });
    const contact_id = lead.contact.id;

    const lead_options = {
      method: 'PATCH',
      url: `${this.url}/api/v4/leads/${id}`,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      data: {
        custom_fields_values: lead_custom_fields_values
      }
    };

    if (status_id) {
      lead_options.data.status_id = status_id;
    }

    if (pipeline_id) {
      lead_options.data.pipeline_id = pipeline_id;
    }

    const response = {};

    if (name || email || phone || contact_custom_fields_values.length > 0) {
      const kommoUtils = new KommoUtils({ contacts_custom_fields: await this.getContactsCustomFields() });

      const contact_options = {
        method: 'PATCH',
        url: `${this.url}/api/v4/contacts/${contact_id}`,
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `Bearer ${this.auth}`
        },
        data: {
          custom_fields_values: contact_custom_fields_values
        }
      };

      if (name) {
        contact_options.data.name = name;
      }

      if (email || phone) {
        if (email) {
          const emailField = kommoUtils.findContactsFieldByCode('EMAIL') || kommoUtils.findContactsFieldByName('E-mail');
          contact_options.data.custom_fields_values.push({
            field_id: emailField.id,
            values: [
              {
                value: email,
                enum_code: emailCode || 'WORK'
              }
            ]
          });
        }

        if (phone) {
          const phoneField = kommoUtils.findContactsFieldByCode("PHONE") || kommoUtils.findContactsFieldByName('Telefone');
          contact_options.data.custom_fields_values.push({
            field_id: phoneField.id,
            values: [
              {
                value: kommoUtils.formatPhone(phone),
                enum_code: phoneCode || 'WORK'
              }
            ]
          });
        }
      }

      const { data: contactData } = await axios.request(contact_options);
      styled.success('[KommoServices.updateLeadComplex] - Contact updated');
      response.contact = contactData;
    }

    const { data: leadData } = await axios.request(lead_options);
    styled.success('[KommoServices.updateLeadComplex] - Lead updated');
    response.lead = leadData;
    return response;
  }

  /**
   * Método para buscar leads com base em uma consulta
   * 
   * @param {object} object
   * @param {string} object.query Consulta para buscar os leads
   * @param {boolean} object.first_created Se true, retorna o primeiro lead criado
   * @param {string} object.withParams Parâmetro para trazer informações adicionais do lead
   * @return {Promise<object>} Retorna os dados dos leads encontrados
   * 
   */
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

  /**
   * Método para buscar leads com base em uma consulta
   * 
   * @returns {Promise<object>} Retorna os dados dos leads encontrados
   */
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

  /**
   * Método para buscar os campos customizados dos leads
   * 
   * @returns {Promise<object[]>} Retorna os dados dos campos customizados dos leads
   */
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

  /**
   * Método para buscar os pipelines
   * 
   * @returns {Promise<object>} Retorna os dados dos pipelines
   */
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

  /**
   * Método para buscar os usuários
   * @returns {Promise<object[]>} Retorna os dados dos usuários
   */
  async getUsers() {
    const options = {
      method: 'GET',
      url: `${this.url}/api/v4/users`,
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      }
    }
    const { data: { _embedded: { users } } } = await axios.request(options);
    styled.success('[KommoServices.getUsers] - Users fetched');
    return users;
  }

  /**
   * Método para criar uma tarefa em um lead
   * @param {object} objeto de criação da tarefa
   * @param {number} objeto.lead_id ID do lead
   * @param {string} objeto.text Texto da tarefa
   * @param {number} [objeto.responsible_user_id] ID do usuário responsável pela tarefa
   * @param {number} [objeto.complete_till] Data de conclusão da tarefa em segundos (Unix timestamp)
   * @param {number} [objeto.task_type_id] ID do tipo de tarefa (padrão é 1)
   * @returns {Promise<object>} Retorna a tarefa criada
   */
  async createTaskInLead({ entity_type = 'leads', entity_id, text, responsible_user_id = 0, complete_till = 0, task_type_id = 1 }) {
    const options = {
      method: 'POST',
      url: `${this.url}/api/v4/tasks`,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${this.auth}`
      },
      data: [
        {
          entity_type,
          entity_id: Number(entity_id),
          text,
          task_type_id,
          ...(responsible_user_id && { responsible_user_id }),
        }
      ]
    };

    if (complete_till) {
      options.data[0].complete_till = complete_till;
    } else {
      const now = new Date();
      const nowInSeconds = Math.floor(now.getTime() / 1000);
      options.data[0].complete_till = nowInSeconds + 600 // 10 minutos a partir de agora
    }

    const { data } = await axios.request(options);
    styled.success('[KommoServices.createTaskInLead] - Task created in lead');
    return { code: 201, response: data };
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

  async sendErrorLog({ lead_id, error }) {
    const kommoUtils = new KommoUtils({ leads_custom_fields: await this.getLeadsCustomFields() });

    const logField = kommoUtils.findLeadsFieldByName('GPT | LOG');
    const custom_fields_values = [
      {
        field_id: logField.id,
        values: [
          {
            value: error
          }
        ]
      }
    ];
    
    const response = await this.updateLead({
      id: lead_id,
      custom_fields_values
    });
    return response;
  }
};
