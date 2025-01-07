
import { google } from 'googleapis';
import service_account from '../../config/service_account.json' with { type: 'json' };

export class AuthCalendar {
  static authenticate() {
    return new google.auth.JWT({
      email: service_account.client_email,
      key: service_account.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
      subject: 'clinicadentalsante@gmail.com'
    });
  }
}
