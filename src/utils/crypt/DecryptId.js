require('dotenv').config();
const crypto = require('crypto');
const styled = require('../log/styledLog');

const DecryptId = (id) => {
  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.CRYPTO_KEY),
      Buffer.from(process.env.CRYPTO_IV)
    );
    let decrypted = decipher.update(id, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    styled.error('Error on DecryptId:', error);
    throw new Error('Error on DecryptId');
  }
};

module.exports = DecryptId;
