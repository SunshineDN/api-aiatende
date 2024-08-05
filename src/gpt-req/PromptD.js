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
    this.d_intencao = this.d_intencao.bind(this);
    this.d_verificar_confirmacao = this.d_verificar_confirmacao.bind(this);
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
      res.status(200).send({ message: 'Prompt enviado com sucesso', response: message });
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      await SendLog(req.body, `Erro ao enviar prompt: ${error.message}`, access_token);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  // BOT D

  async d_intencao(req, res) {
    console.log('Verificando intenção | Intenção do usuário...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const answer = await GetAnswer(req.body, access_token);
      const messageReceived = await GetMessageReceived(req.body, access_token);
      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

      const text = `Aja como um especialista em análise de dados para consultórios médicos. 
Considere que você esteja analisando a intenção de resposta digitada por um usuário em um chatbot. A Data e Hora atual são: ${date}. Analise a mensagem do consultório: '${answer}' e veja em quais das situações abaixo encaixa a intenção da resposta digitada pelo usuário: '${messageReceived}'.
#Saudacao: Para leads Realizando a Saudação (ex: Oi, Olá, Bom dia, Boa noite, Tudo bem? etc).

#continuar: Para leads que estão escolhendo uma opções de data e horários de agendamento.
(ex: pode ser, ok, 16, 16h, 19/01, 16h a tarde, manhã, tarde, noite, 16/12/24, outras opções de horário e etc).

#cadastro: Para leads que responderam seus dados cadastrais: nome completo, data de nascimento, bairro ou e-mail (nelson coutinho, 16/12/77, Piedade, drnelsoncoutinho@hotmail.com, etc).

#tratamento: Para leads buscando informações dos tipos de tratamentos odontológicos;

#Informacao: Para leads buscando informações sobre a clínica.

#valores: Para leads buscando valores dos serviços ou consulta inicial.

#Agendamento: Para leads com intenção clara de marcar uma consulta inicial.

#Profissional: Para leads interessados em emprego ou apresentação de produtos ou serviços.

#Perdido: Quando houver um pedido para desistência da conversa.
#ClienteAntigo: Para leads que se tornaram Cliente, pois já realizaram a consulta inicial e querem agendar ou pagar o tratamento.

#FeedbackReclamacao: Para leads que desejam deixar feedback ou reclamação.

#Geral: Para os demais assuntos. 

#1mes: Para leads que ainda não pretendem agendar neste momento.

#OutraData: Caso esteja querendo remarcar para outra data, ou saber outras opções de datas.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra:" Exemplo: #Agendamento`;
      this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  async d_verificar_confirmacao(req, res) {
    console.log('Verificando confirmação | Confirmação de datas...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const answer = await GetAnswer(req.body, access_token);

      const text = `Seja como especialista em agendamento de consultas. Considere que você está analisando a intenção de uma frase digitada pelo Consultório em um chatbot, e analise em quais das situações abaixo estão inseridas a intenção da frase digitada: '${answer}'

#IndefiniteDate: Se na frase digitada pelo consultório estiver como opções de agendamento, sugestões de dados de agendamento ou informando preferências de dados de agendamento, conforme exemplos: 
' 1- Com base na disponibilidade e no horário de funcionamento do consultório, as opções de agendamento para o dia 15 de junho de 2024, no período da tarde, são as seguintes:
- Terça-feira, 15 de junho de 2024, às 16:00
 Esses dados e horários estão disponíveis para a sua consulta inicial. Gostaria de reservar para esse horário? 

2- Gostaria de oferecer as seguintes opções de agendamento: - Segunda-feira (06/10/2024) às 14h00, ou - Terça-feira (06/11/2024) às 10h00;
 as opções disponíveis para agendamento são:
- Quinta-feira (13/06/2024) às 14h00
- Sexta-feira (14/06/2024) às 16h00
 
3- Posso reservar a sua consulta para um desses horários?;
tenho disponibilidade nos seguintes horários à tarde:
- Terça-feira, 11 de junho de 2024, às 14:00
- Terça-feira, 11 de junho de 2024, às 16:00
Qual dessas fica melhor para você?;

 4- Os dados disponíveis para agendamento são:
- Quinta-feira (13/06/2024) às 08h00
- Quinta-feira (13/06/2024) às 09h00.
 Por favor, confirme se uma dessas opções é adequada para você, e em seguida, providenciaremos o agendamento.

5- sabemos que precisou reagendar sua consulta. Não se preocupe, estamos aqui para ajudar.
As opções disponíveis para o reagendamento são:
- Quarta-feira, 19 de junho de 2024, às 10:00
- Quinta-feira, 20 de junho de 2024, às 15:00
Por gentileza, informe-nos quais essas opções funcionam melhor para você.'

#ConfirmDate: Se na frase digitada pelo consultório afirmou que a consulta está agendada ou confirmada, conforme exemplo: 'Perfeito! Sua consulta está agendada para terça-feira, 11/06/2024, às 16h no Consultório Dr. Nelson Bechara Coutinho, Av. Eng. Domingos Ferreira, 636, Ed Clinical Center Karla Patrícia. 1o andar, sala 109. Estamos ansiosos para recebê-lo'

#demais: Se a frase digitada pelo consultório não se enquadrar como uma consulta agendada ou aberta, nem opções de agendamento.  

Responda apenas com o ID correspondente da opção, que segue este padrão: "#palavra:" Exemplo: #IndefiniteDate`;
      this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }
}

module.exports = new PromptD();