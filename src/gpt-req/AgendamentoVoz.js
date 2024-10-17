require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require('../services/kommo/GetAccessToken');
const GetMessageReceived = require('../services/kommo/GetMessageReceived');
const LeadQuery = require('../services/kommo/LeadQuery');
const SendLog = require('../services/kommo/SendLog');
const SendMessage = require('../services/kommo/SendMessage');
const FormatTelephone = require('../utils/FormatTelephone');

class AgendamentoVoz {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.prompt = this.prompt.bind(this);
    this.voice_schedule = this.voice_schedule.bind(this);
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

  async voice_schedule(req, res) {
    console.log('Assistant | BOT - Agendamento por Voz...');
    let access_token;
    try {
      // const { lead_id: leadID } = req.body;
      // const { assistant_id } = req.params;
      access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const message_received = await GetMessageReceived(req.body);
      const prompt_text = `Analise a mensagema recebida: ${message_received}. Agora retire apenas os dados desejados a seguir, em ordem: Nome, bairro, data de nascimento, dentista, data do agendamento (Data e hora) e telefone. Os dados devem estar em ordem seguindo o padrão chave: valor, separados por ponto e vírgula ( ; ) e na mesma linha, sem pular para a próima linha ou conter o código ( \n ). Caso esteja faltando algum dado retorne 'null'. O campo dentista deve ter o Doutor ou Doutora abreviado para Dr. ou Dra. e em seguida o nome do dentista.
      
Por exemplo:
Nome: Fulano de Tal; Bairro: Centro; Data de Nascimento: 01/01/2000; Dentista: Dr. João; Data do Agendamento: 01/01/2022 10:00; Telefone: (11) 99999-9999`;
      const { message: prompt_message } = await OpenAIController.promptMessage(prompt_text);
      console.log('Prompt recebido do agendamento por VOZ:', prompt_message);

      const name = prompt_message.split('; ').filter(value => value.includes('Nome:'))[0]?.split(': ')[1] || 'null';
      const bairro = prompt_message.split('; ').filter(value => value.includes('Bairro:'))[0]?.split(': ')[1] || 'null';
      const birthdate = prompt_message.split('; ').filter(value => value.includes('Data de Nascimento:'))[0]?.split(': ')[1] || 'null';
      const dentist = prompt_message.split('; ').filter(value => value.includes('Dentista:'))[0]?.split(': ')[1] || 'null';
      const schedule_date = prompt_message.split('; ').filter(value => value.includes('Data do Agendamento:'))[0]?.split(': ')[1] || 'null';
      const phone = prompt_message.split('; ').filter(value => value.includes('Telefone:'))[0]?.split(': ')[1] || 'null';

      // Montar um objeto apenas com os dados existentes que forem diferentes de 'null'
      const obj = {
        name: name !== 'null' ? name : null,
        bairro: bairro !== 'null' ? bairro : null,
        birthdate: birthdate !== 'null' ? birthdate : null,
        dentist: dentist !== 'null' ? dentist : null,
        schedule_date: schedule_date !== 'null' ? schedule_date : null,
        phone: phone !== 'null' ? FormatTelephone(phone) : null
      };

      const text = await LeadQuery(req.body, obj, access_token);

      await SendMessage(req.body, false, text, access_token);
      res.status(200).send({ message: 'Lead criado via agendamento por VOZ com sucesso!', response: text });
    } catch (error) {
      console.log('Erro ao criar / atualizar lead via agendamento por VOZ:', error);
      res.status(500).send('Erro ao criar / atualizar lead via agendamento por VOZ');
    }
  }
}

module.exports = new AgendamentoVoz();
