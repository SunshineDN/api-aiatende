
import { google } from 'googleapis';
import service_account from '../../config/service_account.json' with { type: 'json' };

export default class AuthCalendar {
  static #authInstance = null;

  static authenticate() {
    if (!this.#authInstance) {
      this.#authInstance = new google.auth.JWT(
        service_account.client_email,
        null,
        service_account.private_key,
        ['https://www.googleapis.com/auth/calendar']
      );
    }

    return this.#authInstance;
  }
}
