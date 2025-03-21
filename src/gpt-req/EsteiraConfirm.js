
const OpenAIController = require('../controllers/OpenAIController.js');
// const TextToSpeech = require('../services/gpt/TextToSpeech');
const GetAccessToken = require('../services/kommo/GetAccessToken.js');
const GetAnswer = require('../services/kommo/GetAnswer.js');
const GetMessageReceived = require('../services/kommo/GetMessageReceived.js');
const GetUser = require('../services/kommo/GetUser.js');
const SendLog = require('../services/kommo/SendLog.js');
const SendMessage = require('../services/kommo/SendMessage.js');
const { default: DateUtils } = require('../utils/DateUtils.js');

class EsteiraConfirm {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.prompt = this.prompt.bind(this);
    this.intencao = this.intencao.bind(this);
    this._24h_1 = this._24h_1.bind(this);
    this._24h_2 = this._24h_2.bind(this);
    this._24h_3 = this._24h_3.bind(this);
    this._3h_1 = this._3h_1.bind(this);
    this._3h_2 = this._3h_2.bind(this);
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

  async intencao(req, res) {
    console.log('Prompt | BOT - Pós-Agendamento | Intenção - Esteira de Confirmações...');
    try {
      const access_token = GetAccessToken();

      const answer = await GetAnswer(req.body, access_token);
      const message_received = await GetMessageReceived(req.body, access_token);

      const text = `Analise a mensagem da clínica: ${answer} e veja em quais das situações abaixo encaixa a intenção da resposta do usuário: '${message_received}'.

#Confirmou: Usuário confirmou a presença.

#NãoConfirmou: Usuário não confirmou a presença.

#Geral: Para os demais assuntos.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra:" Exemplo: #Geral'`;

      await this.prompt(req, res, text);
    } catch (error) {
      console.log(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  async _24h_1(req, res) {
    console.log('Assistant | BOT - Pós-Agendamento | Esteira de Confirmação 24 horas 1/3...');
    try {
      const access_token = GetAccessToken();
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const user = await GetUser(req.body, false, access_token);

      const scheduled_date = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Data do Evento'
      )[0];
      const scheduled_date_value = scheduled_date?.values[0]?.value * 1000;
      const date = DateUtils.formatDate({ date: scheduled_date_value, withWeekday: true });

      const text = `System message: 'Retorne apenas uma mensagem para o usuário para a confirmação da sua ida para a clínica no dia: ${date}. Aqui vai um exemplo de mensagem: "Lembre-se do compromisso da sua consulta odontológica com *DENTISTA* é AMANHÃ

Dia e Hora:
19/08/2024 às 14:30

Não esqueça de confirmar sua presença, respondendo esta mensagem agora!

Confirmado?"'`;

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

  async _24h_2(req, res) {
    console.log('Assistant | BOT - Pós-Agendamento | Esteira de Confirmação 24 horas 2/3...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `System message: Usuário passou 2 horas sem responder a mensagem anterior, retorne apenas uma mensagem dizendo que é muito importante que ele confirme a presença no dia marcado. Exemplo de mensagem: "Olá, Tudo bem? Ainda não recebemos a confirmação da sua presença na consulta odontológica de amanhã.
Por favor, confirmar o mais rápido possível, Obrigada!

Confirmado?"`;

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

  async _24h_3(req, res) {
    console.log('Assistant | BOT - Pós-Agendamento | Esteira de Confirmação 24 horas 3/3...');
    try {
      const access_token = GetAccessToken();
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const user = await GetUser(req.body, false, access_token);

      const scheduled_date = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Data do Evento'
      )[0];
      const scheduled_date_value = scheduled_date?.values[0]?.value * 1000;
      const date = DateUtils.formatDate({ date: scheduled_date_value, withWeekday: true });

      const text = `System message: Usuário passou mais 2 horas sem responder a mensagem anterior, retorne apenas uma mensagem pedindo para ele confirmar sua presença para o dia: ${date}. Exemplo de mensagem: "Gostaria de lembrar que o processo de confirmação da consulta é muito importante. Temos que planejar adequadamente seu atendimento. Por favor, confirme sua presença respondendo agora esta mensagem.

Dia e Hora:
19/08/2024 às 14:30

Local: Av. Bernardo Vieira de Melo, 2418. Piedade, Jaboatão dos Guararapes - PE. (Próximo ao Banco Bradesco)

Confirmado?"`;

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

  async _3h_1(req, res) {
    console.log('Assistant | BOT - Pós-Agendamento | Esteira de Confirmação 3 horas 1/2...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `System message: Usuário confirmou e a consulta dele será *HOJE*. Retorne apenas uma mensagem pedindo para ele confirmar a presença. Exemplo de mensagem: "É *HOJE* sua consulta odontológica!

Por favor, confirme agora sua presença.

Dia e hora:

19/08/2024 às 14:00

Ok?"`;

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

  async _3h_2(req, res) {
    console.log('Assistant | BOT - Pós-Agendamento | Esteira de Confirmação 3 horas 2/2...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = 'System message: Usuário passou 30 minutos sem responder a mensagem anterior, retorne apenas uma mensagem perguntando se pode confirmar a presença dele.';

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

module.exports = new EsteiraConfirm();
