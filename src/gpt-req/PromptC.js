require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require("../services/kommo/GetAccessToken");
const GetAnswer = require("../services/kommo/GetAnswer");
const GetMessageReceived = require("../services/kommo/GetMessageReceived");
const SendLog = require("../services/kommo/SendLog");
const SendMessage = require("../services/kommo/SendMessage");


class PromptC {
  constructor() {
    this.index = this.index.bind(this);
    this.prompt = this.prompt.bind(this);
    this.c_intencao = this.c_intencao.bind(this);
    this.c_confirma_dados = this.c_confirma_dados.bind(this);
    this.c_intencao_especialista = this.c_intencao_especialista.bind(this);
    this.c_identificar_especialista = this.c_identificar_especialista.bind(this);
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

  // BOT C

  async c_intencao(req, res) {
    console.log('Recebendo requisição de prompt...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const answer = await GetAnswer(req.body, access_token);
      const message_received = await GetMessageReceived(req.body, access_token);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

      // const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      // const weekOptions = {
      //   timeZone: 'America/Recife',
      //   weekday: 'long'
      // };
      // const weekDay = date.toLocaleDateString('pt-BR', weekOptions);
      // const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `System message:'Aja como um especialista em análise de dados para clínicas odontológicas. 
  Considere que você esteja analisando a intenção de uma resposta digitada por um usuário em um chatbot. A Data e Hora atual são: ${date}. Analise a mensagem do sistema: '${answer}' e veja em quais das situações abaixo encaixa a intenção desta frase digitada: '${message_received}'.
  
  #Saudacao: Para usuário Realizando a Saudação (ex: Oi, Olá, Bom dia, Boa noite, Tudo bem? etc).
  
  #cadastro: Para usuário que respondem informam dados pessoais, como: nome completo, plano de saúde ou convênio médico (ou caso seja consulta particular), e/ou telefone (ex: augencio leite ferreira neto, amil, 8191929779). Consultas particulares se encaixam nessa opção.
  
  #tratamento: Para usuário buscando informações dos tipos de tratamentos médicos, cirurgias, trombose, varizes, vasos sanguíneos, artérias, edemas, outras doenças vasculares;
  
  #Informacao: Para usuário buscando informações sobre o consultório médico, informações sobre Dr.Nelson, Curriculum Dr.Nelson, qual a especialidade médica.
  
  #valores: Para usuário buscando valores dos serviços ou consulta inicial.
  
  #Agendamento: Para usuário com intenção clara de marcar uma consulta inicial. Consultas particulares não se encaixam nessa opção. (exemplo: agendar, marcar, consultar).
  
  #Profissional: Para usuário interessados em emprego ou apresentação de produtos ou serviços.
  
  #ClienteAntigo: Para usuário que se tornaram Cliente e pagar o tratamento proposto.
  
  #Geral: Para os demais assuntos. 
  
  #AgendaFutura: Para usuário que ainda não pretendem agendar neste momento.
  
  Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra" Exemplo: #Agendamento'`;
      console.log('Prompt recebido!');
      console.log('Preparando para enviar prompt...');
      await this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  async c_confirma_dados(req, res) {
    console.log('Recebendo requisição de prompt...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const message_received = await GetMessageReceived(req.body, access_token);
      const answer = await GetAnswer(req.body, access_token);
      const text = `Analise a pergunta do consultório: '${answer}' e a resposta do usuário: '${message_received}' e verifique as intenções abaixo qual melhor se encaixa:

#ConfirmouDados: APENAS se a resposta do usuário está confirmando os dados dele descrito na pergunta do consultório, exemplo:
Pergunta do consultório: 'Augencio, para confirmar, temos os seguintes dados:
- Nome completo: Augencio Leite
- Plano: Consulta particular
Por favor, confirme se está tudo correto!'
Resposta do usuário: '(sim, está tudo correto, ok)'

#Continuar: Se o usuário ainda está fornecendo dados que foi pedido na pergunta do consultório ou não confirmar os dados dele e quer alterar, exemplos:”
Pergunta do consultório: 'Augencio, só está faltando a informação sobre o tipo de plano. Você pode me informar se será um plano de saúde ou se a consulta será particular?'
Resposta do usuário: '(consulta particular, amil, unimed, plano sulamerica)'
Pergunta do consultório: 'Para prosseguir com o agendamento, preciso que você informe:
 
1 - Nome Completo:
2 - Confirme se será a consulta particular ou qual o seu plano de saúde.
 
Assim poderei completar seu cadastro e agendar sua consulta'
Resposta do usuário: 'Juliana Leite, Amil'"

#ReiniciarConfirmação: Caso a resposta do usuário seja corrigindo algum dado cadastral que já foi armazenado no sistema, como nome completo, tipo de plano de saúde ou convênio médico, telefone: (ex: douglas augusto, amil, 8196724310)

Identifique a intenção da resposta do usuário baseada na pergunta do consultório, e retorne apenas o id das opções listadas acima, por exemplo: #Continuar`;
      console.log('Prompt recebido!');
      console.log('Preparando para enviar prompt...');
      await this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  async c_intencao_especialista(req, res) {
    console.log('Recebendo requisição de prompt...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const answer = await GetAnswer(req.body, access_token);
      const message_received = await GetMessageReceived(req.body, access_token);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

      const text = `System message: ' Considere que você esteja analisando a intenção de uma resposta digitada por um usuário em um chatbot. A data e hora atual são: ${date}. Analise a mensagem da clínica: '${answer}' e veja em quais das situações abaixo encaixa a intenção desta frase digitada: '${message_received}'. ’
  
#Confirmou: Caso a resposta do usuário esteja CONFIRMANDO a mensagem da clínica.

#Novamente: Caso o usuário esteja querendo trocar a opção atual ou escolher outra.

#Parar: Se o usuário estiver com intenção de parar ou descontinuar o chat.
  
#Geral: Para os demais assuntos. 
  
Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra" Exemplo: #Agendamento'.`

      console.log('Prompt recebido!');
      console.log('Preparando para enviar prompt...');
      await this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  async c_identificar_especialista(req, res) {
    console.log('Recebendo requisição de prompt...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const answer = await GetAnswer(req.body, access_token);
      const message_received = await GetMessageReceived(req.body, access_token);

      const text = `Analise a mensagem da clínica: '${answer}' e a resposta do usuário: '${message_received}' e verifique nas opções abaixo, qual mais se encaixa na intenção da frase.

#Juliana: Caso a resposta do usuário seja CONFIRMANDO a Dra. Juliana Leite ou Reabilitadora Oral.

#Isento: Se a resposta do usuário for CONFIRMANDO Dentistas Especialista da equipe (sem custo).

#Odontopediatria: Se a resposta do usuário CONFIRMA odontopediatria, kids (Crianças até 12 anos).

#Geral: Nenhum dos cenários anteriores.

Retorne apenas o ID da opção após o #, por exemplo: #Isento`

      console.log('Prompt recebido!');
      console.log('Preparando para enviar prompt...');
      await this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }
}

module.exports = new PromptC();