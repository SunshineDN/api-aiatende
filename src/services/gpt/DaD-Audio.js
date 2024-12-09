const axios = require('axios');
const fs = require('fs');
const styled = require('../../utils/log/styledLog');

const downloadAudio = async (file) => {
  try {
    const response = await axios.get(file.url, {
      responseType: 'stream'
    });

    const filePath = `./public/files/${file.name}.${file.extension}`;
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

const deleteTempFile = async (file) => {
  try {
    const filePath = `./public/files/${file.name}.${file.extension}`;
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

module.exports = {
  downloadAudio,
  deleteTempFile
};
