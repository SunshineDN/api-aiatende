import OpenAIController from '../controllers/OpenAIController.js';
import { GetGptAssistantMessage } from '../services/gpt/GetGptAssistantMessage.js';
import { GetGptPromptMessage } from '../services/gpt/GetGptPrompMessage.js';
import { SpeechToText } from '../services/gpt/SpeechToText.js';
import { TextToSpeech } from '../services/gpt/TextToSpeech.js';
import { GetAccessToken } from '../services/kommo/GetAccessToken.js';
import { SendLog } from '../services/kommo/SendLog.js';
import { Fill_Lead_Message } from '../services/gpt/Fill_Lead_Message.js';

export default class GptController {

  static async index(_, res) {
    res.status(200).json({ message: 'Hello World' });
  }

  static async messageToAssistant(req, res) {
    const { assistant_id } = req.params;
    try {
      const access_token = GetAccessToken();
      await GetGptAssistantMessage(req.body, assistant_id, access_token);
      res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
      console.error('Error on messageToAssistant:', error);
      res.status(500).json({ error });
    }
  }

  static async messageToPrompt(req, res) {
    try {
      const access_token = GetAccessToken();
      await GetGptPromptMessage(req.body, access_token);
      res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
      console.error('Error on messageToPrompt:', error);
      res.status(500).json({ error });
    }
  }

  static async transcribeMessage(req, res) {
    try {
      const access_token = GetAccessToken();
      if (req.body?.type !== 'voice' && req.body?.type !== 'audio') {
        const last_message = {
          type: 'text',
          text_audio: req?.body?.text_audio
        };
        await Fill_Lead_Message(req.body, last_message, access_token);
        res.status(200).json({ message: 'Mensagem transcrita com sucesso!' });
      }
      await SpeechToText(req.body, access_token);
    } catch (error) {
      console.error('Error on transcribeMessage:', error);
      res.status(500).json({ error });
    }
  }

  static async sendAudioFromGpt(req, res) {
    try {
      const access_token = GetAccessToken();
      await TextToSpeech(req.body, access_token);
      res.status(200).json({ message: 'Áudio enviado com sucesso!' });
    } catch (error) {
      console.error('Error on sendAudioFromGpt:', error);
      res.status(500).json({ error });
    }
  }

  static async deleteThread(req, res) {
    const { lead_id } = req.body;
    try {
      const access_token = GetAccessToken();
      await OpenAIController.deleteThread(lead_id);
      await SendLog(req.body, 'Histórico de conversas no assistente apagados com sucesso!', access_token);
      res.status(200).json({ message: 'Histórico de conversas no assistente apagados com sucesso!' });
    } catch (error) {
      console.error('Error on deleteThread:', error);
      res.status(500).json({ error });
    }
  }
};