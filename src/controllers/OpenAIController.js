import axios from 'axios';
import OpenAI from 'openai';
import { Op } from 'sequelize';
import styled from '../utils/log/styled.js';
// import LeadThread from '../models/lead_threads.js';
import models from '../models/index.js';
import { transcribeAudio } from '../services/gpt/TranscribeAudio.js';
import { getFileNameFromUrl } from '../utils/GetNameExtension.js';
import { downloadAudio, deleteTempFile } from '../services/gpt/DaD-Audio.js';
import { ensureThread, fetchLatestAssistantMessage, runWithPolling, sendUserMessage } from '../utils/OpenAIThreads.js';

const openai = new OpenAI(process.env.OPENAI_API_KEY);
const LeadThread = models.LeadThread;

export default class OpenAIController {

  static async createThread(lead_id, assistant_id) {
    try {
      const existThreads = await LeadThread?.findOne({
        where: {
          lead_id
        }
      });

      if (!existThreads) {
        styled.info('Creating thread for lead in database for first time');
        await LeadThread.create({
          lead_id
        });
        const newThread = await openai.beta.threads.create({
          metadata: {
            user: lead_id.toString()
          }
        });
        styled.success('Thread created in OpenAI for first time');
        styled.successdir(newThread);

        styled.info('Updating thread_id in database for first time');
        await LeadThread.update({
          thread_id: [newThread.id],
          assistant_id: [assistant_id]
        }, {
          where: {
            lead_id
          }
        });
        styled.success('ThreadID updated in database for first time');
        return;
      } else {
        styled.info('Thread already exists in database');
        const newThread = await openai.beta.threads.create({
          metadata: {
            user: lead_id.toString()
          }
        });
        styled.success('Thread created in OpenAI');
        styled.successdir(newThread);

        styled.info('Updating thread_id in database');
        let newArrayAssistans = existThreads.assistant_id || [];
        let newArrayThreads = existThreads.thread_id || [];

        await LeadThread.update({
          thread_id: [...newArrayThreads, newThread.id],
          assistant_id: [...newArrayAssistans, assistant_id]
        }, {
          where: {
            lead_id
          }
        });
        styled.success('Assistant added to thread');
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static async generateMessage(info) {
    const { text, lead_id, assistant_id } = info;

    const assistant = atob(assistant_id);

    try {
      let existThreads = await LeadThread?.findOne({
        where: {
          lead_id,
          assistant_id: {
            [Op.contains]: [assistant]
          }
        }
      });

      if (!existThreads) {
        await OpenAIController.createThread(lead_id, assistant);
        existThreads = await LeadThread.findOne({
          where: {
            lead_id,
            assistant_id: {
              [Op.contains]: [assistant]
            }
          }
        });
      }

      styled.info('Thread found');
      styled.infodir(existThreads.dataValues);

      const indexOfAssistant = existThreads.assistant_id.indexOf(assistant);
      styled.info('Index of assistant', indexOfAssistant);

      styled.info('Sending message to assistant');

      const sanitizedText = (text ?? "").trim();

      await openai.beta.threads.messages.create(
        existThreads.thread_id[indexOfAssistant],
        {
          role: 'user',
          content: sanitizedText.length > 0 ? sanitizedText : '[]',
        }
      );

      const wait = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      };

      styled.info('Running assistant');

      let run;
      const exec = async (times) => {
        let count = 1;
        let repeat = 1;
        while (repeat <= times) {
          run = await openai.beta.threads.runs.create(
            existThreads.thread_id[indexOfAssistant],
            { assistant_id: assistant }
          );
          while (count <= 10) {
            run = await openai.beta.threads.runs.retrieve(
              existThreads.thread_id[indexOfAssistant],
              run.id
            );
            styled.info(`[Lead ${lead_id}] - ${repeat}# ${count}' Run status: ${run?.status}`);
            if (run.status === 'completed') {
              styled.success(`[Lead ${lead_id}] - Run completed`);
              return;
            } else if (run.status !== 'completed' && repeat === times && count === 10) {
              styled.warning(`[Lead ${lead_id}] - Run not completed`);
              if (run.status === 'failed') {
                styled.error(`[Lead ${lead_id}] - Run failed`);
                throw new Error(`Erro no running da mensagem do Assistant GPT: ${run?.last_error?.message}`);
              } else if (run.status === 'expired') {
                styled.error(`[Lead ${lead_id}] - Run expired`);
                throw new Error('O tempo de execução do Assistant GPT expirou');
              } else {
                styled.warning(`[Lead ${lead_id}] - Run not completed`);
              }
            }
            await wait(1000);
            count++;
          }
          run = await openai.beta.threads.runs.cancel(
            existThreads.thread_id[indexOfAssistant],
            run.id
          );
          let cancel_time = 1;
          while (run.status !== 'cancelled' && run.status !== 'expired' && run.status !== 'failed') {
            run = await openai.beta.threads.runs.retrieve(
              existThreads.thread_id[indexOfAssistant],
              run.id
            );
            styled.warning(`\n[Lead ${lead_id}] - Timing for cancel: ${cancel_time}`);
            styled.warning(`[Lead ${lead_id}] - Run status for cancel: ${run.status}`);
            styled.warning(`Cancel? ${run.status === 'cancelled'}
Expired? ${run.status === 'expired'}
Failed? ${run.status === 'failed'}`);
            cancel_time++;
            await wait(1000);
          };
          cancel_time = 1;
          count = 1;
          repeat++;
        }
      };

      await exec(6);

      const messages_response = await openai.beta.threads.messages.list(
        existThreads.thread_id[indexOfAssistant]
      );

      return { message: messages_response?.data[0]?.content[0]?.text?.value };
    } catch (error) {
      styled.error('Erro ao enviar mensagem para o assistente:', error);
      throw new Error(error);
    }
  }

  static async promptMessage(text) {
    try {
      const completions = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: text
          }
        ],
        model: 'gpt-4o-mini'
      });

      return { message: completions.choices[0].message.content };
    } catch (error) {
      styled.error('Erro ao gerar mensagem para o prompt:', error);
      throw new Error(error);
    }
  }

  static async listMessages(lead_id) {

    try {
      const existThreads = await LeadThread?.findOne({
        where: {
          lead_id
        }
      });

      if (!existThreads) {
        return { message: 'Thread not found' };
      }

      const messages = await openai.beta.threads.messages.list(
        existThreads.thread_id
      );

      return messages;
    } catch (error) {
      styled.error('Erro ao listar mensagens:', error);
      throw new Error(error);
    }
  }

  static async deleteThread(lead_id) {
    try {
      const existThreads = await LeadThread?.findOne({
        where: {
          lead_id
        }
      });

      if (!existThreads) {
        return { message: 'Thread not found' };
      }

      await openai.beta.threads.del(existThreads.thread_id);
      await LeadThread.destroy({
        where: {
          lead_id
        }
      });

      return { message: 'Thread deleted' };
    } catch (error) {
      styled.error('Erro ao deletar thread:', error);
      throw new Error(error);
    }
  }

  static async audioToText(audio_link, lead_id) {

    if (!audio_link || !lead_id) {
      throw new Error('Missing parameters');
    }

    const fileObj = getFileNameFromUrl(audio_link, lead_id);

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

  static async textToAudio(message, voice, phone, business) {

    let access_token, instance_id;

    styled.info('Business:', business);
    if (business === 'kommoatende') {
      access_token = process.env.API_KEY_ZAPSTER_AIATENDE;
      instance_id = process.env.INSTANCE_ID_ZAPSTER_AIATENDE;
    } else if (business === 'kommoagendamento') {
      access_token = process.env.API_KEY_ZAPSTER_DENTALSANTE;
      instance_id = process.env.INSTANCE_ID_ZAPSTER_DENTALSANTE;
    }

    styled.info('API Key:', access_token);
    styled.info('Instance ID:', instance_id);

    if (!message || !phone) {
      styled.error('Missing parameters');
      throw new Error('Missing parameters');
    }

    const URL = 'https://new-api.zapsterapi.com/v1/wa/messages';
    const headers = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    };
    const phone_number = phone.replace('+', '');
    const data = {
      media: { ptt: true, base64: null },
      instance_id: instance_id,
      recipient: phone_number
    };

    try {
      styled.info('\nGenerating audio with voice:', voice);
      styled.info('Audio Message:', message);

      const mp3 = await openai.audio.speech.create({
        'model': 'tts-1',
        'voice': voice,
        'input': message
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      data.media.base64 = buffer.toString('base64');

      await axios.post(URL, data, { headers });
      // return { message: 'Audio sent' };
      styled.log('magenta', '===============\nAudio sent\n===============');
      return;
    } catch (error) {
      styled.error('Error ao gerar e enviar audio:', error);
      throw new Error(error);
    }
  }

  static async generateText(message) {
    try {
      const { data } = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      });
      return data;
    } catch (error) {
      styled.error('Erro ao gerar texto para o prompt:', error);
      throw new Error(error);
    }
  }
}