require('dotenv').config();
const crypto = require('crypto');

const EncryptId = (id) => {
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.CRYPTO_KEY), Buffer.from(process.env.CRYPTO_IV));
    let encrypted = cipher.update(id, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    console.error('Error on EncryptId:', error);
    throw new Error('Error on EncryptId');
  }
};

module.exports = EncryptId;
