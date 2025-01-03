import styled from "../../utils/log/styledLog.js";
import axios from "axios";

export default class KommoServices {
  constructor({auth, url}) {
    this.auth = auth;
    this.url = url;
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

  async createLead(params) {

  }

  async createLeadBk(obj) {
    const { type } = obj;
    if (type === 'lead') {
      const { name, email, phone, datanascimento } = obj.value;
      
    }
  };

};