
const OpenAIFirstController = require('../controllers/OpenAIFirstController.js');
const GetAccessToken = require('../services/kommo/GetAccessToken.js');
const GetMessageReceived = require('../services/kommo/GetMessageReceived.js');
const SendLog = require('../services/kommo/SendLog.js');
const SendMessage = require('../services/kommo/SendMessage.js');


class GlobalAssistant {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.only_assistant = this.only_assistant.bind(this);
  }

  async assistant(req, res, data) {
    let access_token;
    try {
      console.log('Enviando para o assistente GPT...');
      access_token = GetAccessToken();
      console.log('Mensagem enviada para o assistente:', data.text);
      const { message } = await OpenAIFirstController.generateMessage(data);
      console.log('Resposta recebida do assistente:', message);
      await SendMessage(req.body, true, message, access_token);
      res.status(200).send({ message: 'Mensagem enviada com sucesso para o assistente', response: message });
    } catch (error) {
      console.log(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      await SendLog(req.body, `Erro ao enviar mensagem para o assistente: ${error.message}`, access_token);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  async only_assistant(req, res) {
    console.log('Recebendo requisição de assistente | Only Assistant (Apenas Assistente)...');
    try {
      const access_token = GetAccessToken();
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const data = {
        leadID,
        text: message_received,
        assistant_id,
      };

      await this.assistant(req, res, data);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para a assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para a assistente');
    }
  }
}

module.exports = new GlobalAssistant();
