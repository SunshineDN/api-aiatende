import axios from 'axios';
import path from 'path';
import fs from 'fs';
import styled from './log/styledLog.js';
import OpenAI from 'openai';

export default class OpenAIUtils {
  constructor() {
    this.openai = new OpenAI(process.env.OPENAI_API_KEY);
  }

  async downloadFile(link, file_name) {
    try {
      const __dirname = path.resolve();

      const response = await axios.get(link, {
        responseType: 'stream',
        timeout: 30000,
      });

      if (!fs.existsSync(path.join(__dirname, 'public', 'files'))) {
        fs.mkdirSync(path.join(__dirname, 'public', 'files'), { recursive: true });
      }

      const filePath = path.join(__dirname, 'public', 'files', file_name);

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          styled.success(`Arquivo baixado com sucesso: ${file_name}`);
          resolve(filePath);
        });
        writer.on('error', (err) => {
          styled.error('Erro ao gravar o arquivo:', err);
          reject(err);
        });
      });
    } catch (error) {
      styled.error('Erro ao fazer download do arquivo:');
      throw new Error(error);
    }
  }

  async transcribeAudio(file_name) {
    const __dirname = path.resolve();

    const filePath = path.join(__dirname, 'public', 'files', file_name);

    const file = fs.createReadStream(filePath);

    const transcription = await this.openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });
    return transcription.text;
  }

  async deleteTempFile(file_name) {
    try {
      const __dirname = path.resolve();
      const filePath = path.join(__dirname, 'public', 'files', file_name);

      if (!fs.existsSync(filePath)) {
        styled.warning(`Arquivo não encontrado para exclusão: ${file_name}`);
        return;
      } else {
        fs.unlinkSync(filePath);
        styled.success(`Arquivo temporário deletado: ${file_name}`);
      }
    } catch (error) {
      styled.error('Erro ao deletar o arquivo temporário:', error);
      throw new Error(`Erro ao deletar o arquivo temporário: ${error.message}`);
    }
  }
}