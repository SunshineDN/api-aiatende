
const OpenAIController = require('../controllers/OpenAIController.js');
const GetAccessToken = require('../services/kommo/GetAccessToken.js');
const SendLog = require('../services/kommo/SendLog.js');
const SendMessage = require('../services/kommo/SendMessage.js');


class GlobalPrompt {
  constructor() {
    this.index = this.index.bind(this);
    this.prompt = this.prompt.bind(this);
    this.faltosos = this.faltosos.bind(this);
  }

  index(req, res) {
    res.send('Hello, World!');
  }

  async prompt(req, res, text) {
    let access_token;
    try {
      console.log('Enviando prompt...');
      access_token = GetAccessToken();
      console.log('Mensagem enviada para o prompt:', text);
      const { message } = await OpenAIController.promptMessage(text);
      console.log('Resposta recebida do prompt:', message);
      await SendMessage(req.body, false, message, access_token);
      res.status(200).send({ message: 'Prompt enviado com sucesso', response: message });
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      await SendLog(req.body, `Erro ao enviar prompt: ${error.message}`, access_token);
      res.status(500).send('Erro ao enviar prompt');
    }
  }
}

module.exports = new GlobalPrompt();
