import styled from '../../utils/log/styled.js';

export const GetAccessToken = () => {
  try {
    const access_token = process.env.KOMMO_AUTH;
    return access_token;
  } catch (error) {
    styled.error('Erro ao adquirir tokens:', error);
    throw new Error('Erro no GetAccessToken');
  }
};