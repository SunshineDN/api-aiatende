require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require('../services/kommo/GetAccessToken');
const GetAnswer = require('../services/kommo/GetAnswer');
const SendLog = require('../services/kommo/SendLog');
const SendMessage = require('../services/kommo/SendMessage');

class Cutucada {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.prompt = this.prompt.bind(this);
    this.gerar_perguntas = this.gerar_perguntas.bind(this);
    this.assistente = this.assistente.bind(this);
  }

  async assistant(req, res, data) {
    let access_token;
    try {
      console.log('Enviando para o assistente GPT...');
      access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);

      console.log('Mensagem enviada para o assistente:', data.text);
      const { message } = await OpenAIController.generateMessage(data);
      console.log('Resposta recebida do assistente:', message);
      await SendMessage(req.body, message, access_token);
      res.status(200).send({ message: 'Mensagem enviada com sucesso para o assistente', response: message });
    } catch (error) {
      console.log(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      await SendLog(req.body, `Erro ao enviar mensagem para o assistente: ${error.message}`, access_token);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  async prompt(req, res, text) {
    let access_token;
    try {
      console.log('Enviando prompt...');
      access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      console.log('Mensagem enviada para o prompt:', text);
      const { message } = await OpenAIController.promptMessage(text);
      console.log('Resposta recebida do prompt:', message);
      await SendMessage(req.body, message, access_token);
      res.status(200).send({ message: 'Prompt enviado com sucesso', response: message });
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      await SendLog(req.body, `Erro ao enviar prompt: ${error.message}`, access_token);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  async gerar_perguntas(req, res) {
    console.log('Prompt | BOT - Cutucada | Gerar Perguntas...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);

      const answer = await GetAnswer(req.body, access_token);

      const text = `O usuário está há algum tempo sem responder, retorne penas uma pergunta para o usuário para ele retomar a conversa, aqui vai alguns exemplos: 'Vamos continuar?', 'Estou te aguardando', 'Continua ai?', 'Ainda interessado?'

Observe a resposta anterior da clínica: '${answer}'

Pode utilizar alguns dos exemplos, mas tente produzir sempre mensagens novas.`;

      await this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  async assistente(req, res) {
    console.log('Assistant | BOT - Cutucada | Assistente...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `System message: Retorne uma mensagem para continuar conversando, sem ser sobre agendar, para o usuário sobre o assunto que estava ocorrendo nas últimas mensagens.`;

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await this.assistant(req, res, data);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para a assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para a assistente');
    }
  }
}

module.exports = new Cutucada();