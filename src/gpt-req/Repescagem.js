require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require('../services/kommo/GetAccessToken');
const GetAnswer = require('../services/kommo/GetAnswer');
const GetMessageReceived = require('../services/kommo/GetMessageReceived');
const SendLog = require('../services/kommo/SendLog');
const SendMessage = require('../services/kommo/SendMessage');

class Repescagem {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.prompt = this.prompt.bind(this);
  }

  async assistant(req, res, data) {
    let access_token;
    try {
      console.log('Enviando para o assistente GPT...');
      access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
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
      access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
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

  async frio(req, res) {
    console.log('Assistant | BOT - Repescagem | Frio...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `Enviar mensagem para um chatbot numa tentativa de reativar os usuários que entraram em contato e depois da nossa resposta continuaremos sem dar continuidade na conversa há mais de 7 dias. Utilize mensagem direta, amigável e oferece opções para o lead interagir com o chatbot, facilitando a reativação do contato, utilizando alguns dos focos a seguir: Relembrar o valor, Oferecer algo novo, Criar urgência, Solicitar feedback, Mostrar disponibilidade. (nunca repetir uma mensagem) Exemplo: "Olá,

Notamos que você não respondeu às nossas últimas mensagens e queremos saber se ainda podemos ajudar a cuidar do seu sorriso! Na Clínica Dental Santé, estamos sempre prontos para oferecer o melhor atendimento odontológico para você.

Se precisar de uma consulta ou tiver alguma dúvida, estamos à disposição. Além disso, temos algumas novidades e condições especiais que podem ser do seu interesse!

Gostaria de agendar uma consulta ou saber mais sobre nossas condições?

Sim, quero agendar uma consulta.
Gostaria de saber mais sobre as condições.
Tenho uma dúvida. Aguardamos seu retorno!
Atenciosamente, Gabriele"`

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await this.assistant(req, res, data);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  async congelado(req, res) {
    console.log('Assistant | BOT - Repescagem | Congelado...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `Enviar mensagem para chatbot numa tentativa de reativar os usuários que entraram em contato e depois das nossas inúmeras respostas continuamos sem ter retorno do usuário há mais de 30 dias. Utilize mensagem direta, amigável e oferece opções para o lead interagir com o chatbot, facilitando a reativação do contato, utilizando alguns dos focos a seguir: Relembrar o valor, Oferecer algo novo, Criar urgência, Solicitar feedback, Mostrar disponibilidade. (nunca repetir uma mensagem). conforme exemplo: "Olá,

Notamos que você não respondeu às nossas últimas mensagens e queremos saber se ainda podemos ajudar a cuidar do seu sorriso! Na Clínica Dental Santé, nossas condições especiais terminam em breve. Não perca a oportunidade de aproveitar essas nossas formas exclusivas!

Gostaria de agendar uma consulta ou saber mais sobre nossas promoções?

Sim, quero agendar uma consulta.
Gostaria de saber mais sobre as promoções.
Tenho uma dúvida. Aguardamos seu retorno!
Atenciosamente, Gabriele"`

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await this.assistant(req, res, data);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  async intencao(req, res) {
    console.log('Prompt | BOT - Repescagem | Intenção...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);

      const message_received = await GetMessageReceived(req.body, access_token);
      const answer = await GetAnswer(req.body, access_token);

      const text = `Considere que você esteja analisando a intenção da resposta de um usuário em um chatbot. Analise a mensagem da clínica: '${answer}', e veja em quais das situações abaixo se encaixa a intenção da mensagem do usuário: '${message_received}'.

      #Perdido: Para usuário que não quer mais receber mensagens, não quer mais contato ou não deseja mais informações.

      #Informação: Para usuário que está interessado em receber informações ou precisando de mais informações, mas não quer agendar uma consulta.

      #Agendamento: Para usuário com intenção clara de marcar uma consulta inicial.

      #Geral: Para os demais assuntos.
      
      Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra" Exemplo: #Agendamento'`;

      await this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }
}
module.exports = new Repescagem();
