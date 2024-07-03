const { google } = require('googleapis');

class AuthCalendar {
  authenticate(account_id) {
    if (account_id) {
      const service_account_path = `../config/service_account_${account_id}.json`;
      const serviceAccount = require(service_account_path);
      return new google.auth.JWT({
        email: serviceAccount.client_email,
        key: serviceAccount.private_key,
        scopes: ['https://www.googleapis.com/auth/calendar']
      });
    }
  }
}

module.exports = new AuthCalendar;
