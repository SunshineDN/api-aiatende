require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require('../services/kommo/GetAccessToken');
const GetMessageReceived = require('../services/kommo/GetMessageReceived');
const GetUser = require('../services/kommo/GetUser');
const SendLog = require('../services/kommo/SendLog');
const SendMessage = require('../services/kommo/SendMessage');


class AssistantE {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.faltosos = this.faltosos.bind(this);
    this.confirmacao_vinda = this.confirmacao_vinda.bind(this);
    this.reagendamento = this.reagendamento.bind(this);
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

  async faltosos(req, res) {
    console.log('Recebendo requisição de assistente | Faltosos...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const message_received = await GetMessageReceived(req.body, access_token);

      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `System message: Retorne uma mensagem educada e informativa ao usuário informando que ele perdeu a sessão agendada. Inclua os seguintes pontos:

- Lembrete do compromisso que foi perdido (data e hora).
- Importância da sessão.
- Pedir desculpas pelo inconveniente e mostrar disposição para ajudar a reagendar.

Exemplo de mensagem:
Olá Augêncio,

Notamos que você não pôde comparecer à sua sessão agendada conosco no dia 05/08/2024 10:00. Entendemos que imprevistos acontecem e gostaríamos de ajudar a remarcar essa sessão para um momento mais conveniente para você.

Por favor, entre em contato conosco para reagendarmos. Estamos à disposição para encontrar um horário que se encaixe melhor na sua agenda.

Agradecemos a sua compreensão e aguardamos seu retorno.

User message:
'${message_received}'`;

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

  async confirmacao_vinda(req, res) {
    console.log('Recebendo requisição de assistente | Confirmar Vinda...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const user = await GetUser(req.body, false, access_token);
      const scheduleDate = user?.custom_fields_values?.filter(field => field.field_name === 'Event Start')[0];
      const scheduleDateValue = scheduleDate?.values[0]?.value;

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `System message: Envie uma mensagem para que o usuário confirme sobre a data de agendamento: '${scheduleDateValue}'. Se baseie no dia atual: '${weekDayFormatted}, ${date}' e retorne quanto tempo falta em dia(s) e hora(s) para a consulta do usuário (12 horas, amanhã, hoje).`;

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await this.assistant(req, res, data);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para a assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  async reagendamento(req, res) {
    console.log('Recebendo requisição de assistente | Reagendamento...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const message_received = await GetMessageReceived(req.body, access_token);

      const text = `System message: O usuário deseja reagendar. Retorne uma mensagem que iremos continuar com o reagendamento dele e fornecer as datas em breve.
User message: '${message_received}'`;

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await this.assistant(req, res, data);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para a assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }
}

module.exports = new AssistantE();
