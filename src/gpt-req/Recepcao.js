require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require('../services/kommo/GetAccessToken');
const GetAnswer = require('../services/kommo/GetAnswer');
const GetMessageReceived = require('../services/kommo/GetMessageReceived');
const SendLog = require('../services/kommo/SendLog');
const SendMessage = require('../services/kommo/SendMessage');

class Recepcao {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.prompt = this.prompt.bind(this);
    this.intencao = this.intencao.bind(this);
    this.indefinido = this.indefinido.bind(this);
    this.nao_qualificado = this.nao_qualificado.bind(this);
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

  async intencao(req, res) {
    console.log('Prompt | BOT - Recepção | Intenção...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);

      const message_received = await GetMessageReceived(req.body, access_token);
      const answer = await GetAnswer(req.body, access_token);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `Dia de Semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3). 

Considere que você esteja analisando a intenção de uma frase digitada por um usuário em um chatbot. Analise a mensagem do consultório (se houver): '${answer}' e veja em quais das situações abaixo se encaixa a intenção da mensagem do usuário: '${message_received}'.

#Saudacao: Para usuário realizando a Saudação (ex: Oi, Olá, Bom dia, Boa noite, Tudo bem? etc).

#Informacao: Para usuário buscando informações, informando sintomas, pedindo por tratamento médico, informações sobre o médico, consultórios ou valores dos serviços, valor da consulta, informações sobre plano de saúde ou convênio médico.

#Agendamento: Para usuário com intenção clara de marcar ou agendar uma consulta inicial.

#Profissional: Para usuários interessados em emprego, representante comercial, apresentação de produtos, apresentação de serviços, apresentação de remedios ou  medicamentos.

#Geral: Para os demais assuntos.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra" Exemplo: #Agendamento'`;
      await this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  async indefinido(req, res) {
    console.log('Assistant | BOT - Recepção | Indefinido...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const message_received = await GetMessageReceived(req.body, access_token);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `System message: 'Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3).

Recebendo um usuário novo. Inicie a conversa perguntando o seu nome, caso já tenha o seu nome utilize, pois demonstra maior proximidade, e na sequência entenda os seus interesses e as suas dúvidas médicas. Apresentar que o consultório Dr. Nelson Bechara Coutinho é o local certo para resolver suas questões de saúde.'  

User message: '${message_received}'`;

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

  async nao_qualificado(req, res) {
    console.log('Assistant | BOT - Recepção | Não Qualificado...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `System message: "Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3).

Mensagem do usuário: '${message_received}.'

Avaliar a intenção do usuário e seguir 

1) Se a intenção da mensagem do usuário for vender ou oferecer produto, serviços médicos, representante comercial ou de marketing, então conduza com a seguinte resposta, exemplo:
'Muito obrigado pelo seu interesse! 
Segue nosso e-mail: *consultoriodrnelsonc@gmail.com* e contato telefônico: (81) 3325-4955.
Pedimos para nos enviar um e-mail ou no ligar para agendamento com nosso time administrativo '

2) Se a intenção da mensagem do usuário for de se candidatar alguma vaga disponível no consultório ou enviar o curriculum, então conduza com a seguinte resposta, exemplo:
'Muito obrigado pelo seu interesse! 
Segue nosso e-mail: *consultoriodrnelsonc@gmail.com*
Seus dados será direcionado ao time de Gestão de Pessoas.'

3) Se a intenção da mensagem do usuário demonstrar que tenha procurado por engano com nada relacionado a medicina, então conduza com a seguinte resposta, exemplo:
'Somos o Consultório de *Dr. Nelson Bechara Coutinho*, estamos sempre à disposição para realizar o seu tratamento médico. 
Quando quiser, estamos de portas abertas pra melhor recebê-lo.'

4) Se a intenção da mensagem do usuário for para deixar algum feedback positivo ou negativo sobre o Consultório Dr. Nelson Bechara Coutinho, então conduza com a seguinte resposta, exemplo:
'Agradecemos pelo seu Feedback. 
Suas Sugestões, Elogios ou Reclamações serão informadas diretamente à nossa Diretoria.'

5) Se não for nada acima relacionado, então aja da seguinte fotma:  
'Receba como usuário novo. 
Inicie a conversa perguntando o seu nome para demonstrar proximidade, e na sequência entender os seus interesses e as suas dúvidas médicas. Mostrar que o Consultório Dr. Nelson Bechara Coutinho é o local certo para resolver suas questões de saúde.'"`;

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

module.exports = new Recepcao();
