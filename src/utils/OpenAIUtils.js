import axios from 'axios';
import path from 'path';

export default class OpenAIUtils {
  static async downloadFile(link, file_name) {
    try {
      const response = await axios.get(link, {
        responseType: 'stream',
        timeout: 30000,
      });

      const __dirname = path.resolve();
      // const filePath = `./public/files/${file_name}`;
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
  }
}