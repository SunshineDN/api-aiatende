import { google } from "googleapis";
import service_account from '../config/service_account.json' with { type: 'json' };


export default class GoogleClient {
  #authInstance = null;
  #scopes = [];

  /**
   * @param {Object} options - Opções de configuração
   * @param {Array<string>} options.scopes - Escopos de autenticação
   */
  constructor({ scopes = [] } = {}) {
    this.#scopes = scopes;
    this.#authInstance = new google.auth.JWT(
      service_account.client_email,
      null,
      service_account.private_key,
      this.#scopes
    );
  }

  /**
   * Autentica o cliente Google
   * @returns {google.auth.JWT} - Instância autenticada do cliente Google
   */
  authenticate() {
    if (!this.#authInstance) {
      this.#authInstance = new google.auth.JWT(
        service_account.client_email,
        null,
        service_account.private_key,
        this.#scopes
      );
    }
    google.options({ auth: this.#authInstance });

    return;
  }
}