
import { google } from 'googleapis';
import service_account_dental_sante from '../../config/service_account_32000011.json' with { type: 'json' };

export class AuthCalendar {
  static authenticate() {
    return new google.auth.JWT({
      email: service_account_dental_sante.client_email,
      key: service_account_dental_sante.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });
  }
}
