const { google } = require('googleapis');

class AuthCalendar {
  authenticate(account_id) {
    const serviceAccount = require(`../config/serviceAccount${account_id}.json`);
    return new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });
  }
}

module.exports =  new AuthCalendar;
