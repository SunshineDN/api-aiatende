require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require('../services/kommo/GetAccessToken');
const GetAnswer = require('../services/kommo/GetAnswer');
const GetMessageReceived = require('../services/kommo/GetMessageReceived');
const GetUser = require('../services/kommo/GetUser');
const SendLog = require('../services/kommo/SendLog');
const SendMessage = require('../services/kommo/SendMessage');
const SetActualDateHour = require('../services/kommo/SetActualDateHour');
const CalendarIdValidate = require('../utils/calendar/CalendarIdValidate');
const CalendarUtils = require('../utils/calendar/CalendarUtils');


class PromptD {
  constructor() {
    this.index = this.index.bind(this);
    this.prompt = this.prompt.bind(this);
    this.d_intencao = this.d_intencao.bind(this);
    this.d_verificar_confirmacao = this.d_verificar_confirmacao.bind(this);
    this.d_confirmar_data = this.d_confirmar_data.bind(this);
    this.d_verificar_agenda_especialista = this.d_verificar_agenda_especialista.bind(this);
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
      console.log('Mensagem enviada para o prompt:', text);
      await SendMessage(req.body, false, message, access_token);
      console.log('Resposta recebida do prompt:', message);
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
      const message_received = await GetMessageReceived(req.body, access_token);
      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

      const text = `Aja como um especialista em análise de dados para clínicas odontológicas. 
Considere que você esteja analisando a intenção de resposta digitada por um usuário em um chatbot. A data e hora atual são: ${date}. Analise a mensagem da clínica: '${answer}' e veja em quais das situações abaixo encaixa a intenção da resposta digitada pelo usuário: '${message_received}'.

#Saudacao: Para leads Realizando a Saudação (ex: Oi, Olá, Bom dia, Boa noite, Tudo bem? etc).

#continuar: Para leads que estão escolhendo uma opções de data e horários de agendamento.
(ex: pode ser, ok, 16, 16h, 19/01, 16h a tarde, manhã, tarde, noite, 16/12/24, outras opções de horário e etc).

#cadastro: Para leads que responderam seus dados cadastrais: nome completo, data de nascimento, bairro ou e-mail (augencio leite, 16/12/77, Candeias, augencio@hotmail.com, etc).

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
      const message_received = await GetMessageReceived(req.body, access_token);

      const text = `Aja como especialista em agendamento de consultas. Considere que você está analisando a intenção de uma pergunta da clínica: '${answer}' verifique também a resposta do USUÁRIO: '${message_received}' e veja em qual das intenções abaixo a resposta do usuário melhor se encaixa.

#IndefiniteDate: Se na frase digitada pela clínica estiver como opções de pré-agendamento, sugestões de datas de pré-agendamento ou informando preferências de datas de pré-agendamento, conforme exemplos: 
' 1- Com base na disponibilidade e no horário de funcionamento da clínica, as opções de pré-agendamento para o dia 15 de junho de 2024, no período da tarde, são as seguintes:
- Terça-feira, 15 de junho de 2024, às 16:00
 Esse data e horário está disponível para a sua consulta inicial. Gostaria de reservar para esse horário? 

2- Gostaria de oferecer as seguintes opções de pré-agendamento: - Segunda-feira (06/10/2024) às 14h00, ou - Terça-feira (06/11/2024) às 10h00;

3- As opções disponíveis para pré-agendamento são:
- Quinta-feira (13/06/2024) às 14h00
- Sexta-feira (14/06/2024) às 16h00;
 
4- Posso reservar a sua consulta para um desses horários:
- Terça-feira, 11 de junho de 2024, às 14:00
- Terça-feira, 11 de junho de 2024, às 16:00
Qual dessas fica melhor para você?

 5- Os dados disponíveis para pré-agendamento são:
- Quinta-feira (13/06/2024) às 08h00
- Quinta-feira (13/06/2024) às 09h00.
 Por favor, confirme se uma dessas opções é adequada para você, e em seguida, providenciaremos o agendamento.'

#ConfirmDate: Se o usuário confirma a mensagem da clínica, ou escolhe um horário para o pré-agendamento.

#demais: Se o usuário quer continuar escolhendo outro horário e data diferente do apresentado.

Responda apenas com o ID correspondente da opção, que segue este padrão: "#palavra:" Exemplo: #IndefiniteDate`;
      this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  async d_confirmar_data(req, res) {
    console.log('Confirmando data | Confirmação de datas...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      await SetActualDateHour(req.body, access_token);

      const user = await GetUser(req.body, false, access_token);
      const choice_date = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Data escolhida'
      )[0];

      const answer = await GetAnswer(req.body, access_token);

      const text = `Dia da semana, data e hora atual: '${weekDayFormatted}, ${date}'. Na resposta abaixo se basear na data atual.
Considere a resposta a seguir:

[
 ${choice_date?.values[0]?.value || answer}
]

Retorne apenas o dia agendado e as horas formatadas no padrão brasileiro, por exemplo: 10/09/2024 10:30
Não formate as linhas da resposta solicitada.`;
      this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  async d_verificar_agenda_especialista(req, res) {
    console.log('Verificando agenda do especialista | Agenda do especialista...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const CalendarUtilsClass = new CalendarUtils(req.body.account.id);
      // const actual_date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      // const weekOptions = {
      //   timeZone: 'America/Recife',
      //   weekday: 'long'
      // };
      // const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      // const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const user = await GetUser(req.body, false, access_token);

      const choice_date = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Data escolhida'
      )[0];

      const nameDoctor = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Dentista'
      )[0];

      let dates;
      try {
        dates = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não encontrado', req.body.account.id));
      } catch {
        dates = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não encontrado', req.body.account.id));
      }

      const text = `Observe a frase a seguir: '${choice_date?.values[0]?.value}'. Capture a data e horário contida na frase e identifique se ela existe como opção na *Agenda Disponível* a seguir:

*Agenda Disponível*:

[
${dates}
]

Caso a data e horário contida na frase exista na *Agenda Disponível*, retorne apenas o ID: #Existe, caso o contrário, retorne apenas o ID: #NãoExiste.`;

      await this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }
}

module.exports = new PromptD();
