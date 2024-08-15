require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require('../services/kommo/GetAccessToken');
const GetAnswer = require('../services/kommo/GetAnswer');
const GetMessageReceived = require('../services/kommo/GetMessageReceived');
const SendLog = require('../services/kommo/SendLog');
const SendMessage = require('../services/kommo/SendMessage');

class Aquecimento {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.prompt = this.prompt.bind(this);
    this.aquecimento = this.aquecimento.bind(this);
    this.intencao = this.intencao.bind(this);
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

  async aquecimento(req, res) {
    console.log('Assistant | BOT - Recepção | Aquecimento do Lead...');
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

O usuário entrou no fluxo do agendamento, ou seja, o usuário quer ter informações sobre a clínica, algum tratamento específico, ou valores.
Vamos mostrar nosso conhecimento com respostas bem precisas, mas de simples entendimento, além de apresentar que Clínica Dental Santé através da estrutura, dos equipamentos, da equipe podem faz muita diferença para realizar a sua consulta inicial. Crie cada vez mais desejo para que ele queira agendar sua consulta odontológica conosco. Nunca informar valores dos tratamentos odontológicos. Não oferecer nenhuma data para agendamento nesta etapa'

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

      const text = `System message: 'Aja como um especialista em análise de dados para clínicas odontológicas.
Considere que você esteja analisando a intenção de uma frase digitada por um usuário em um chatbot. Dia de Semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3). Analise a mensagem da clínica: ${answer} e veja em quais das situações abaixo encaixa a intenção da resposta do usuário: '${message_received}'.
#Saudacao: Para leads Realizando a Saudação (exemplo: Oi, Olá, Bom dia, Boa noite, Tudo bem? etc).

#tratamento: Para leads buscando informações dos tipos de tratamentos odontológicos, Implantes, Invisalign, Ortodontia, Extração, Limpeza, HOF, Lentes, Facetas, Prótese, Coroa, Siso, Cirurgia Oral, Periodontia, Odontopediatria e etc;

#Informacao: Para usuário buscando informações sobre a clínica.

#valores: Para usuário buscando valores dos serviços ou consulta inicial.

#Agendamento: Para usuário com intenção clara de marcar uma consulta inicial (exemplo: sim, agendar, marcar, consulta).

#Profissional: Para usuário interessados em emprego ou apresentação de produtos ou serviços.

#Geral: Para os demais assuntos.

#1mes: Para usuário que ainda não pretendem agendar agora, mas tem a intenção de agendar no futuro.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra:" Exemplo: #Agendamento'`;
      await this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
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

      const text = `System message:
"Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3).

Resposta do usuário: ${message_received}

Avaliar a intenção do usuário:

1) Se a intenção do usuário for vender ou oferecer produto ou serviços odontológico, médicos ou de marketing, então conduza com a seguinte resposta, exemplo:
'Muito obrigado pelo seu interesse! 
Segue nosso e-mail: *contato@dentalsante.com.br*
Estamos direcionando o seu atendimento ao nosso setor administrativo e financeiro.

Em breve, te responderão!'

2) Se a intenção do usuário de se candidatar alguma vaga disponível na clínica , então conduza com a seguinte resposta, exemplo:
'Muito obrigado pelo seu interesse! Segue nosso e-mail: *selecao@dentalsante.com.br*
Estamos direcionando o seu atendimento ao setor de Gestão de Pessoas.

Em breve, te responderão!'

3) Se for algum usuário que já é cliente antigo da Dental Santé e queira continuar o atendimento, então conduza com a seguinte resposta, exemplo:
'Como você já é nosso cliente peço falar neste canal exclusivo* 😘 Você tem prioridade em nossos atendimentos.
*Telefone ou WhatsApp*
*(81) 3094-0020*'

4) Se for algum usuário que tenha entrado por engano com nada relacionado a odontologia, então conduza com a seguinte resposta, exemplo:
'Somos a Clínica Odontológica *Dental Santé*, estamos sempre à disposição para Realizar o seu tratamento *saúde e estética Bucal*. Quando quiser estamos de portas aberta.'

5) Se for algum usuário que queira deixar algum feedback positivo ou negativo sobre a clínica Dental Santé, então conduza com a seguinte resposta, exemplo:'
Agradecemos pelo seu Feedback.
Suas Sugestões, Elogios ou Reclamações são informadas diretamente à nossa Diretoria.'

6) Senão for nada do acima, então:
'Receba como usuário novo.
Inicie a conversa perguntando o seu nome para demonstrar proximidade, e na sequência entender os seus interesses e as suas dúvidas odontológicas. Mostrar que a clínica Dental Santé é o local certo para resolver suas questões de saúde odontológicas.'"`;

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

module.exports = new Aquecimento();
