import axios from 'axios';
import fs from 'fs';
import styled from '../../utils/log/styled.js';

export const downloadAudio = async ({ link, file_name }) => {
  try {
    const response = await axios.get(link, {
      responseType: 'stream',
      timeout: 30000,
    });

    const filePath = `./public/files/${file_name}`;
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        styled.success(`Arquivo baixado com sucesso: ${filePath}`);
        resolve(filePath);
      });
      writer.on('error', (err) => {
        styled.error('Erro ao gravar o arquivo:', err);
        reject(err);
      });
    });
  } catch (error) {
    styled.error('Erro ao fazer download do arquivo:', error);
    throw new Error(`Falha no download do áudio: ${error.message}`);
  }
};

export const deleteTempFile = async (file_name) => {
  try {
    const filePath = `./public/files/${file_name}`;
    if (!fs.existsSync(filePath)) {
      styled.warning(`Arquivo não encontrado para exclusão: ${filePath}`);
      return;
    } else {
      fs.unlinkSync(filePath);
      styled.success(`Arquivo temporário deletado: ${filePath}`);
    }
  } catch (error) {
    styled.error('Erro ao deletar o arquivo temporário:', error);
    throw new Error(`Erro ao deletar o arquivo temporário: ${error.message}`);
  }
};