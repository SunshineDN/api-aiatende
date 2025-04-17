import OpenAIUtils from '../../utils/OpenAIUtils.js';
import styled from '../../utils/log/styled.js';

export default class OpenAIServices {

  async transcribeAudio(link, file_name) {
    try {
      const openaiUtils = new OpenAIUtils();

      styled.info('Downloading audio...');
      await openaiUtils.downloadFile(link, file_name);
      styled.success('Success\n');

      styled.info('Transcribing audio...');
      const transcription = await openaiUtils.transcribeAudio(file_name);
      styled.success('Success\n');

      styled.info('Deleting temporary file...');
      await openaiUtils.deleteTempFile(file_name);
      styled.success('Success\n');

      return transcription;
    } catch (error) {
      styled.error('Erro ao gravar audio no armazenamento:');
      console.error(error);
      throw new Error(error);
    }
  }
}