
const OpenAIController = require('../controllers/OpenAIController.js');
const GetAccessToken = require('../services/kommo/GetAccessToken.js');
const GetAnswer = require('../services/kommo/GetAnswer.js');
const GetMessageReceived = require('../services/kommo/GetMessageReceived.js');
const SendLog = require('../services/kommo/SendLog.js');
const SendMessage = require('../services/kommo/SendMessage.js');

class Cutucada {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.prompt = this.prompt.bind(this);
    this.gerar_perguntas = this.gerar_perguntas.bind(this);
    this.intencao = this.intencao.bind(this);
    this.assistente = this.assistente.bind(this);
  }

  async assistant(req, res, data) {
    let access_token;
    try {
      console.log('Enviando para o assistente GPT...');
      access_token = GetAccessToken();
      console.log('Mensagem enviada para o assistente:', data.text);
      const { message } = await OpenAIController.generateMessage(data);
      console.log('Resposta recebida do assistente:', message);
      await SendMessage(req.body, true, message, access_token);
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

  async gerar_perguntas(req, res) {
    console.log('Prompt | BOT - Cutucada | Gerar Perguntas...');
    try {
      const access_token = GetAccessToken();

      const answer = await GetAnswer(req.body, access_token);

      const text = `O usuário está há algum tempo sem responder, faça uma pergunta para o usuário para ele retomar a conversa, aqui vai alguns exemplos: 'Vamos continuar?', 'Estou te aguardando', 'Continua ai?', 'Ainda interessado?'

Observe a resposta anterior da clínica: '${answer}'

Pode utilizar alguns dos exemplos, mas tente produzir sempre mensagens novas. Retorne apenas a pergunta para o usuário.`;

      await this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  async intencao(req, res) {
    console.log('Prompt | BOT - Cutucada | Inteção...');
    try {
      const access_token = GetAccessToken();

      const message_received = await GetMessageReceived(req.body, access_token);
      const answer = await GetAnswer(req.body, access_token);

      const text = `Aja como um analista de marketing experiente e veja se mensagem de pergunta da clínica: ${answer} e a resposta do usuário: '${message_received}'.

Para identifique em qual das situações abaixo melhor se encaixa a intenção do usuário nesta troca de mensagem:

#Perdido: Se o usuário estiver com intenção de encerrar a conversa, ou não quer continuar falando.

#Aguardar: Se o usuário estiver sem poder responder no momento, ou está ocupado, ou está querendo responder depois.

#Continuar: Quando a resposta do usuário quer responder uma mensagem da Clínica. 

#Geral: os demais assuntos.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra:" Exemplo: #Geral'`;

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

      const text = 'System message: Retorne uma mensagem para continuar conversando, sem ser sobre agendar, para o usuário sobre o assunto que estava ocorrendo nas últimas mensagens.';

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
