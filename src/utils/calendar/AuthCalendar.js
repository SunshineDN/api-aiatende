
import { google } from 'googleapis';
import service_account from '../../config/service_account.json' with { type: 'json' };

export class AuthCalendar {
  static authenticate() {
    return new google.auth.JWT(
      service_account.client_email,
      null,
      service_account.private_key,
      ['https://www.googleapis.com/auth/calendar'],
      'clinicadentalsante@gmail.com',
      service_account.client_id
    );
  }
}
