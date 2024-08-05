require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require("../services/kommo/GetAccessToken");
const GetAnswer = require("../services/kommo/GetAnswer");
const GetMessageReceived = require("../services/kommo/GetMessageReceived");
const SendLog = require("../services/kommo/SendLog");
const SendMessage = require("../services/kommo/SendMessage");


class PromptD {
  constructor() {
    this.index = this.index.bind(this);
    this.prompt = this.prompt.bind(this);
  }

  index(req, res) {
    res.send('Hello, World!');
  }

  async prompt(req, res, text) {
    let access_token;
    try {
      console.log('Enviando prompt...');
      access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const { message } = await OpenAIController.promptMessage(text);
      await SendMessage(req.body, message, access_token);
      res.status(200).send('Prompt enviado com sucesso');
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      await SendLog(req.body, `Erro ao enviar prompt: ${error.message}`, access_token);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  // BOT D


}

module.exports = new PromptD();