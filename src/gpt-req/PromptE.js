
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require('../services/kommo/GetAccessToken');
const GetAnswer = require('../services/kommo/GetAnswer');
const GetMessageReceived = require('../services/kommo/GetMessageReceived');
const SendLog = require('../services/kommo/SendLog');
const SendMessage = require('../services/kommo/SendMessage');


class PromptE {
  constructor() {
    this.index = this.index.bind(this);
    this.prompt = this.prompt.bind(this);
    this.faltosos = this.faltosos.bind(this);
    this.identificar_confirmacao = this.identificar_confirmacao.bind(this);
  }

  index(req, res) {
    res.send('Hello, World!');
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
  
  async identificar_confirmacao(req, res) {
    console.log('Identificando confirmação | Identificação de confirmação...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const answer = await GetAnswer(req.body, access_token);
      const messageReceived = await GetMessageReceived(req.body, access_token);

      const text = `Considere que você esteja analisando a intenção de uma frase digitada por um usuário em um chatbot.
Analise a mensagem: '${answer}' e veja em quais das situações abaixo encaixa a intenção para a resposta: '${messageReceived}'.
#Confirmação: A resposta tem intenção de confirmar ou continuar com o agendamento.

#Reagendar: Caso a resposta tenha a intenção de marcar a consulta ou data agendada para outra data.

#Desmarcar: Caso a resposta tenha intenção de desmarcar a consulta.

#Geral: Não condiz com os demais cenários.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra:" Exemplo: #Atendente `;

      this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  async faltosos(req, res) {
    console.log('Recebendo requisição de prompt | Faltosos...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const message_received = await GetMessageReceived(req.body, access_token);
      const answer = await GetAnswer(req.body, access_token);

      const text = `Aqui está a mensagem do consultório: '${answer}', baseada nela, analise a reposta do usuário: '${message_received}'.
Verifique abaixo qual das intenções mais se encaixa com a resposta do usuário.

#Reagendar: Caso o usuário queira dar continuidade em reagendamento.

#Perdido: Caso o usuário não queira mais manter contato com o consultório.

#Geral: Se não for nenhum dos cenários anteriores.

Retorne apenas o ID da intencão antecedido do #, por exemplo: #Geral`;

      await this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }
}

module.exports = new PromptE();
