require('dotenv').config();
const axios = require('axios');
const OpenAI = require('openai');
const { downloadAudio, deleteTempFile } = require('../services/gpt/DaD-Audio');
const LeadThread = require('../models/LeadThread');
const { Op } = require('sequelize');
const transcribeAudio = require('../services/gpt/TranscribeAudio');
const getFileNameFromUrl = require('../utils/GetNameExtension');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

class OpenAIController {
  constructor() {
    this.generateText = this.generateText.bind(this);
    this.textToAudio = this.textToAudio.bind(this);
    this.audioToText = this.audioToText.bind(this);
    this.createThread = this.createThread.bind(this);
    this.generateMessage = this.generateMessage.bind(this);
  }

  async createThread(leadID, assistant_id) {
    try {
      const existThreads = await LeadThread?.findOne({
        where: {
          leadID
        }
      });

      if (!existThreads) {
        console.log('Creating thread for lead in database for first time'.magenta.bold);
        await LeadThread.create({
          leadID
        });
        const newThread = await openai.beta.threads.create({
          metadata: {
            user: leadID.toString()
          }
        });
        console.log('Thread created in OpenAI for first time'.magenta.bold);
        console.log(newThread);

        console.log('Updating threadID in database for first time'.magenta.bold);
        await LeadThread.update({
          threadID: [newThread.id],
          assistant_id: [assistant_id]
        }, {
          where: {
            leadID
          }
        });
        console.log('ThreadID updated in database for first time'.magenta.bold);
        return;
      } else {
        console.log('Thread already exists in database'.magenta.bold);
        const newThread = await openai.beta.threads.create({
          metadata: {
            user: leadID.toString()
          }
        });
        console.log('Thread created in OpenAI'.magenta.bold);
        console.log(newThread);

        console.log('Updating threadID in database'.magenta.bold);
        let newArrayAssistans = existThreads.assistant_id;
        let newArrayThreads = existThreads.threadID;

        await LeadThread.update({
          threadID: [...newArrayThreads, newThread.id],
          assistant_id: [...newArrayAssistans, assistant_id]
        }, {
          where: {
            leadID
          }
        });
        console.log('Assistant added to thread'.magenta.bold);
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async generateMessage(info) {
    const { text, leadID, assistant_id } = info;

    const { decode } = require('base-64');

    // console.log('Texto recebido do usuário:'.magenta.bold, text);

    const assistant = decode(assistant_id);

    try {
      let existThreads = await LeadThread?.findOne({
        where: {
          leadID,
          assistant_id: {
            [Op.contains]: [assistant]
          }
        }
      });

      if (!existThreads) {
        await this.createThread(leadID, assistant);
        existThreads = await LeadThread.findOne({
          where: {
            leadID,
            assistant_id: {
              [Op.contains]: [assistant]
            }
          }
        });
      }

      console.log('Thread found'.magenta.bold);
      console.log(existThreads.dataValues);

      const indexOfAssistant = existThreads.assistant_id.indexOf(assistant);
      console.log('Index of assistant'.magenta.bold, indexOfAssistant);

      console.log('Sending message to assistant'.magenta.bold);
      await openai.beta.threads.messages.create(
        existThreads.threadID[indexOfAssistant],
        {
          role: 'user',
          content: text
        }
      );

      const wait = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      };

      console.log('Running assistant'.magenta.bold);
      // let run = await openai.beta.threads.runs.create(
      //   existThreads.threadID[indexOfAssistant],
      //   { assistant_id: assistant }
      // );

      let run;
      const exec = async (times) => {
        let count = 1;
        let repeat = 1;
        while (repeat <= times) {
          run = await openai.beta.threads.runs.create(
            existThreads.threadID[indexOfAssistant],
            { assistant_id: assistant }
          );
          while (count <= 10) {
            run = await openai.beta.threads.runs.retrieve(
              existThreads.threadID[indexOfAssistant],
              run.id
            );
            console.log(`[Lead ${leadID}] - ${repeat}# ${count}' Run status: ${run.status}`);
            if (run.status === 'completed') {
              console.log(`[Lead ${leadID}] - Run completed`);
              return;
            } else if (run.status !== 'completed' && repeat === times && count === 10) {
              console.log(`[Lead ${leadID}] - Run not completed`);
              if (run.status === 'failed') {
                console.log(`[Lead ${leadID}] - Run failed`);
                throw new Error(`Erro no running da mensagem do Assistant GPT: ${run?.last_error?.message}`);
              } else if (run.status === 'expired') {
                console.log(`[Lead ${leadID}] - Run expired`);
                throw new Error('O tempo de execução do Assistant GPT expirou');
              } else {
                console.log(`[Lead ${leadID}] - Run not completed`);
              }
            }
            await wait(1000);
            count++;
          }
          run = await openai.beta.threads.runs.cancel(
            existThreads.threadID[indexOfAssistant],
            run.id
          );
          let cancel_time = 1;
          while (run.status !== 'cancelled' && run.status !== 'expired' && run.status !== 'failed') {
            run = await openai.beta.threads.runs.retrieve(
              existThreads.threadID[indexOfAssistant],
              run.id
            );
            console.log(`\n[Lead ${leadID}] - Timing for cancel: ${cancel_time}`);
            console.log(`[Lead ${leadID}] - Run status for cancel: ${run.status}`);
            console.log(`Cancel? ${run.status === 'cancelled'}
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
      // await exec(1);

      // while (run.status !== 'completed') {
      //   run = await openai.beta.threads.runs.retrieve(
      //     existThreads.threadID[indexOfAssistant],
      //     run.id
      //   );
      //   console.log('Run status:'.yellow.bold, run.status);
      //   setTimeout(() => { }, 2000);
      // }

      const messages_response = await openai.beta.threads.messages.list(
        existThreads.threadID[indexOfAssistant]
      );

      return { message: messages_response?.data[0]?.content[0]?.text?.value };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async promptMessage(text) {
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
      console.error(error);
      throw new Error(error);
    }
  }

  async listMessages(leadID) {

    try {
      const existThreads = await LeadThread?.findOne({
        where: {
          leadID
        }
      });

      if (!existThreads) {
        return { message: 'Thread not found' };
      }

      const messages = await openai.beta.threads.messages.list(
        existThreads.threadID
      );

      return messages;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async deleteThread(leadID) {
    try {
      const existThreads = await LeadThread?.findOne({
        where: {
          leadID
        }
      });

      if (!existThreads) {
        return { message: 'Thread not found' };
      }

      await openai.beta.threads.del(existThreads.threadID);
      await LeadThread.destroy({
        where: {
          leadID
        }
      });

      return { message: 'Thread deleted' };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async audioToText(audio_link, lead_id) {

    if (!audio_link || !lead_id) {
      throw new Error('Missing parameters');
    }

    const fileObj = getFileNameFromUrl(audio_link, lead_id);

    try {
      console.log('Downloading audio...'.magenta.bold);
      await downloadAudio(fileObj);
      console.log('Success\n'.green.bold);

      console.log('Transcribing audio...'.magenta.bold);
      const transcription = await transcribeAudio(fileObj);
      console.log('Success\n'.green.bold);

      console.log('Deleting temporary file...'.magenta.bold);
      await deleteTempFile(fileObj);
      console.log('Success\n'.green.bold);

      return transcription;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async textToAudio(message, voice, phone, business) {

    let access_token, instance_id;

    console.log('Business:', business);
    if (business === 'kommoatende') {
      access_token = process.env.API_KEY_ZAPSTER_AIATENDE;
      instance_id = process.env.INSTANCE_ID_ZAPSTER_AIATENDE;
    } else if (business === 'kommoagendamento') {
      access_token = process.env.API_KEY_ZAPSTER_DENTALSANTE;
      instance_id = process.env.INSTANCE_ID_ZAPSTER_DENTALSANTE;
    }

    console.log('API Key:', access_token);
    console.log('Instance ID:', instance_id);

    if (!message || !phone) {
      throw new Error('Missing parameters');
    }

    const URL = 'https://new-api.zapsterapi.com/v1/wa/messages';
    const headers = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    };
    const data = {
      media: { ptt: true, base64: null },
      instance_id: instance_id,
      recipient: phone
    };

    try {
      console.log('\nGenerating audio with voice:', voice);
      console.log('Audio Message:', message);

      const mp3 = await openai.audio.speech.create({
        'model': 'tts-1',
        'voice': voice,
        'input': message
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      data.media.base64 = buffer.toString('base64');

      await axios.post(URL, data, { headers });
      // return { message: 'Audio sent' };
      console.log('===============\nAudio sent\n===============');
      return;
    } catch (error) {
      console.error('Error', error.message);
      throw new Error(error);
    }
  }

  async generateText(message) {
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
      console.error(error);
      throw new Error(error);
    }
  }
}

module.exports = new OpenAIController();
