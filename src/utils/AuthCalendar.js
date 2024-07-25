const { google } = require('googleapis');
const service_account = require('../config/service_account.json');

class AuthCalendar {
  authenticate() {
    return new google.auth.JWT({
      email: service_account.client_email,
      key: service_account.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });
  }
}

module.exports = new AuthCalendar;
