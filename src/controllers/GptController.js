const GetGptAssistantMessage = require('../services/gpt/GetGptAssistantMessage');
const GetGptPromptMessage = require('../services/gpt/GetGptPrompMessage');
const SpeechToText = require('../services/gpt/SpeechToText');
const TextToSpeech = require('../services/gpt/TextToSpeech');
const GetAccessToken = require('../services/kommo/GetAccessToken');
const OpenAIController = require('../controllers/OpenAIController');
const SendLog = require('../services/kommo/SendLog');
const Fill_Lead_Message = require('../services/gpt/Fill_Lead_Message');

class GptController {

  async index(req, res) {
    res.status(200).json({ message: 'Hello World' });
  }

  async messageToAssistant(req, res) {
    const { assistant_id } = req.params;

    try {
      const access_token = await GetAccessToken(req.body);
      await GetGptAssistantMessage(req.body, assistant_id, access_token);
    } catch (error) {
      console.error('Error on messageToAssistant:', error);
      res.status(500).json({ error });
    }
  }

  async messageToPrompt(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      await GetGptPromptMessage(req.body, access_token);
    } catch (error) {
      console.error('Error on messageToPrompt:', error);
      res.status(500).json({ error });
    }
  }

  async transcribeMessage(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      if (req.body?.type !== 'voice' && req.body?.type !== 'audio') {
        const last_message = {
          type: 'text',
          text_audio: req?.body?.text_audio
        };
        await Fill_Lead_Message(req.body, last_message, access_token);
        return res.status(200).json({ message: 'Mensagem preenchida com sucesso!' });
      }
      await SpeechToText(req.body, access_token);
    } catch (error) {
      console.error('Error on transcribeMessage:', error);
      res.status(500).json({ error });
    }
  }

  async sendAudioFromGpt(req, res) {
    try {
      const access_token = await GetAccessToken(req.body);
      await TextToSpeech(req.body, access_token);
    } catch (error) {
      console.error('Error on sendAudioFromGpt:', error);
      res.status(500).json({ error });
    }
  }

  async deleteThread(req, res) {
    const { lead_id } = req.body;
    try {
      const access_token = await GetAccessToken(req.body);
      await OpenAIController.deleteThread(lead_id);
      await SendLog(req.body, 'Histórico de conversas no assistente apagados com sucesso!', access_token);
    } catch (error) {
      console.error('Error on deleteThread:', error);
      res.status(500).json({ error });
    }
  }

};

module.exports = new GptController();
