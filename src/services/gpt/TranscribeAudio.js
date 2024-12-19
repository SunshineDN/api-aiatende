import fs from 'fs';
import { openai } from './AuthenticateOpenAI.js';

export const transcribeAudio = async (fileObj) => {
  const file = fs.createReadStream(`./public/files/${fileObj.name}.${fileObj.extension}`);
  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
  });

  return transcription.text;
};