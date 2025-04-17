import { deflate } from 'pako';
import styled from '../log/styled.js';

export const EncryptId = (id) => {
  try {
    const stringId = String(id);
    const compressed = deflate(stringId);
    const base64 = btoa(String.fromCharCode(...compressed));
    return base64.replace(/=+$/, '');
  } catch (error) {
    styled.error('Error on EncryptId:', error);
    throw new Error('Error on EncryptId');
  }
};
