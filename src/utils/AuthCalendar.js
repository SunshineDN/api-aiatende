const { google } = require('googleapis');
const service_account_nelson = require('../config/service_account_nelson.json');

class AuthCalendar {
  authenticate() {
    return new google.auth.JWT({
      email: service_account_nelson.client_email,
      key: service_account_nelson.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });
  }
}

module.exports = new AuthCalendar;
