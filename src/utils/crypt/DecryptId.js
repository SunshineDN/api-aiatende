require('dotenv').config();
const styled = require('../log/styledLog');
const { inflate } = require('pako');

const DecryptId = (compressedID) => {
  try {
    const compressed = Uint8Array.from(atob(compressedID), char => char.charCodeAt(0));
    const originalID = inflate(compressed, { to: 'string' });
    return originalID;
  } catch (error) {
    styled.error('Error on DecryptId:', error);
    throw new Error('Error on DecryptId');
  }
};

module.exports = DecryptId;
