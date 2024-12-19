import { inflate } from 'pako';
import styled from '../log/styledLog.js';

export const DecryptId = (compressedID) => {
  try {
    const compressed = Uint8Array.from(atob(compressedID), char => char.charCodeAt(0));
    const originalID = inflate(compressed, { to: 'string' });
    return originalID;
  } catch (error) {
    styled.error('Error on DecryptId:', error);
    throw new Error('Error on DecryptId');
  }
};