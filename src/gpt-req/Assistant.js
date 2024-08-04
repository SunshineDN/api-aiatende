require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require("../services/kommo/GetAccessToken");
const GetAnswer = require("../services/kommo/GetAnswer");
const GetMessageReceived = require("../services/kommo/GetMessageReceived");
const SendLog = require("../services/kommo/SendLog");
const SendMessage = require("../services/kommo/SendMessage");


class Assistant {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.c_previa_dados = this.c_previa_dados.bind(this);
  }

  async assistant(req, res, data) {
    let access_token;
    try {
      console.log('Enviando para o assistente GPT...');
      access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);

      const { message } = await OpenAIController.generateMessage(data);

      await SendMessage(req.body, message, access_token);
      res.status(200).send('Mensagem enviada para o assistente com sucesso');
    } catch (error) {
      console.log(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      await SendLog(req.body, `Erro ao enviar mensagem para o assistente: ${error.message}`, access_token);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  async c_previa_dados(req, res) {
    console.log('Recebendo requisição de assistente...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `User:
' ${message_received} '`;

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await this.assistant(req, res, data);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para prompt');
    }
  }

  async c_dados_cadastrais(req, res) {
    console.log('Recebendo requisição de assistente...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `System message: Há 2 possibilidades de retorno. Observe a frase: ' ${message_received} ' e veja em qual das opções abaixo melhor se encaixa:

1. Caso a frase contenha dados, retorne apenas uma mensagem para O PRÓPRIO USUÁRIO confirmar os dados, listando eles. Os dados seriam Nome completo e o tipo do plano (ou se vai ser consulta particular).

2. Caso a frase esteja vazia ou faltando algum dos dados (Nome completo e o tipo de plano), retorne apenas uma mensagem pedindo ao usuário que digite o(os) dado(s) que esteja faltando, deixando explícito quais dados são.`;

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await this.assistant(req, res, data);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para prompt');
    }
  }
}

module.exports = new Assistant();