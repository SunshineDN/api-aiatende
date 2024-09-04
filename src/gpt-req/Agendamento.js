require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require('../services/kommo/GetAccessToken');
const GetUser = require('../services/kommo/GetUser');
const SendLog = require('../services/kommo/SendLog');
const SendMessage = require('../services/kommo/SendMessage');
const SetNameFromContact = require('../services/kommo/SetNameFromContact');

class Agendamento {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.prompt = this.prompt.bind(this);
    this.form_join = this.form_join.bind(this);
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

  async form_join(req, res) {
    console.log('Assistant | BOT - Agendamento | Agendamento pelo Formulário...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const user = await GetUser(req.body, true, access_token);
      const username = user?.contact?.name || 'Não encontrado';

      const plano_field = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Plano (Texto)'
      )[0];
      const plano = plano_field?.values[0]?.value || 'Não encontrado';

      const scheduled_date_field = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Data escolhida'
      )[0];
      const scheduled_date = scheduled_date_field?.values[0]?.value || 'Não encontrado';

      const text = `O usuário abaixo foi diretamente agendado pela recepção como um usuário novo, ou é um usuário reagendado e será atualizado os dados. Seguem os dados do usuário:
Nome Completo: ${username}
Tipo de Consulta: ${plano}
Data do agendamento: ${scheduled_date}

Considerar que o usuário passou por todas as etapas para fazer o primeiro agendamento ou reagendamento.`;

      const data = {
        leadID,
        text,
        assistant_id
      };

      await SetNameFromContact(req.body, access_token);
      await this.assistant(req, res, data);
    } catch (error) {
      console.log(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }
}

module.exports = new Agendamento();
