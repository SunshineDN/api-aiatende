
import { google } from 'googleapis';
import { createRequire } from 'module';

export class AuthCalendar {
  static authenticate(account_id) {
    const require = createRequire(import.meta.url);
    const service_account_ai_atende = require('../../config/service_account_31205035.json');
    const service_account_dental_sante = require('../../config/service_account_32000011.json');
    if (account_id === 32000011) {
      return new google.auth.JWT({
        email: service_account_dental_sante.client_email,
        key: service_account_dental_sante.private_key,
        scopes: ['https://www.googleapis.com/auth/calendar']
      });
    } else if (account_id === 31205035) {
      return new google.auth.JWT({
        email: service_account_ai_atende.client_email,
        key: service_account_ai_atende.private_key,
        scopes: ['https://www.googleapis.com/auth/calendar']
      });
    }
  }
}
