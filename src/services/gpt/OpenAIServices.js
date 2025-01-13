import OpenAI from 'openai';

export default class OpenAIServices {
  constructor() {
    this.openai = new OpenAI(process.env.OPENAI_API_KEY);
  }

  async transcriptAudio(attachment, lead_id) {
    try {
      styled.info('Downloading audio...');
      await downloadAudio(fileObj);
      styled.success('Success\n'.green.bold);

      styled.info('Transcribing audio...');
      const transcription = await transcribeAudio(fileObj);
      styled.success('Success\n'.green.bold);

      styled.info('Deleting temporary file...');
      await deleteTempFile(fileObj);
      styled.success('Success\n'.green.bold);

      return transcription;
    } catch (error) {
      styled.error('Erro ao gravar audio no armazenamento:', error);
      throw new Error(error);
    }
  }
}