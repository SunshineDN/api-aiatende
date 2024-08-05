require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require("../services/kommo/GetAccessToken");
const GetAnswer = require("../services/kommo/GetAnswer");
const GetLeadChannel = require('../services/kommo/GetLeadChannel');
const GetLeadInfoForBotC = require('../services/kommo/GetLeadInfoForBotC');
const GetMessageReceived = require("../services/kommo/GetMessageReceived");
const SendLog = require("../services/kommo/SendLog");
const SendMessage = require("../services/kommo/SendMessage");


class AssistantC {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.c_previa_dados = this.c_previa_dados.bind(this);
    this.c_dados_cadastrais = this.c_dados_cadastrais.bind(this);
    this.c_continue_dados_cadastrais = this.c_continue_dados_cadastrais.bind(this);
    this.c_split_dados = this.c_split_dados.bind(this);
    this.c_verifica_dados = this.c_verifica_dados.bind(this);
  }

  async assistant(req, res, data) {
    let access_token;
    try {
      console.log('Enviando para o assistente GPT...');
      access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);

      const { message } = await OpenAIController.generateMessage(data);

      await SendMessage(req.body, message, access_token);
      res.status(200).send('Mensagem enviada para o assistente com sucesso');
    } catch (error) {
      console.log(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      await SendLog(req.body, `Erro ao enviar mensagem para o assistente: ${error.message}`, access_token);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  // BOT C

  async c_previa_dados(req, res) {
    console.log('Recebendo requisição de assistente | Previa Dados...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `User:
' ${message_received} '`;

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

  async c_dados_cadastrais(req, res) {
    console.log('Recebendo requisição de assistente | Dados Cadastrais...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `System message: Há 2 possibilidades de retorno. Observe a frase: ' ${message_received} ' e veja em qual das opções abaixo melhor se encaixa:

1. Caso a frase contenha dados, retorne apenas uma mensagem para O PRÓPRIO USUÁRIO confirmar os dados, listando eles. Os dados seriam Nome completo e o tipo do plano (ou se vai ser consulta particular).

2. Caso a frase esteja vazia ou faltando algum dos dados (Nome completo e o tipo de plano), retorne apenas uma mensagem pedindo ao usuário que digite o(os) dado(s) que esteja faltando, deixando explícito quais dados são.`;

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

  async c_continue_dados_cadastrais(req, res) {
    console.log('Recebendo requisição de assistente | Continue Dados Cadastrais...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const channel = await GetLeadChannel(req.body, access_token);
      console.log('Channel:', channel);
      let text;

      if (channel === 'REDE SOCIAL') {
        text = `Observe os dados cadastrais fornecidos pelo usuário e veja qual dado está faltando. Os dados cadastrais são: Nome completo, tipo de plano (ou se é consulta particular) e telefone. Selecione os dados faltando e retorne uma mensagem para o usuário pedindo os dados faltante para prosseguir no cadastro.`;
      } else {
        text = `Observe os dados cadastrais fornecidos pelo usuário e veja qual dado está faltando. Os dados cadastrais são: Nome completo e tipo de plano (ou se é consulta particular). Selecione os dados faltando e retorne uma mensagem para o usuário pedindo os dados faltante para prosseguir no cadastro.`;
      }

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

  async c_split_dados(req, res) {
    console.log('Recebendo requisição de assistente | Split Dados...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const channel = await GetLeadChannel(req.body, access_token);
      console.log('Channel:', channel);
      let text;

      if (channel === 'REDE SOCIAL') {
        text = `System message: Aja como um analista de dados cadastrais experiente. Nestes dois textos abaixo, analise cuidadosamente os campos para extrair o dado de nome completo, plano de saúde (ou caso seja consulta particular) e telefone.

*Utilize somente dados que esteja nos textos. Agora, avalie os dois textos juntos e extraia o dado no campo: nome completo, plano de saúde (ou caso seja consulta particular) e telefone. Separado apenas com o valor do campo, sem informar o identificador de cada campo, cada campo deve terminar com um ponto e vírgula. Se no texto não existir a informação do campo, retornar apenas o id #ausencia`;
      } else {
        text = `System message: Aja como um analista de dados cadastrais experiente. Nestes dois textos abaixo, analise cuidadosamente os campos para extrair o dado de nome completo e plano de saúde (ou caso seja consulta particular).

*Utilize somente dados que esteja nos textos. Agora, extraia os dados: nome completo, e plano de saúde (ou caso seja consulta particular). Separado apenas com o valor do campo, sem informar o identificador de cada campo, cada campo deve terminar com um ponto e vírgula. Se no texto não existir a informação do campo, retornar apenas o id #ausencia`;
      }

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

  async c_verifica_dados(req, res) {
    console.log('Recebendo requisição de assistente | Verifica Dados...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const channel = await GetLeadChannel(req.body, access_token);
      console.log('Channel:', channel);

      const message_received = await GetMessageReceived(req.body, access_token);
      const info = await GetLeadInfoForBotC(req.body, access_token);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      let text;

      if (channel === 'REDE SOCIAL') {
        text = `System message:'Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3).

O usuário está na etapa de informação dos dados cadastrais para agendamento da sua consulta inicial médica. Sempre agir de maneira humanizada, cordial e gentil. Não passar os dados estratégicos do consultório em nenhum momento nas mensagens.
Antes de solicitar os dados dos campos 1 e 2, informados na frase abaixo, verifique se estão preenchidos ou com ausência de dados, caso algum dos dados dos campos não estejam informados, ou seja, estejam em branco ou não preenchidos, solicitar os dados dos campos ausentes, segue frase: 
"1 - Nome Completo: ${info.nome};
2 - Plano: ${info.plano};
3 - Telefone: ${info.telefone};"
Importante solicitar os dados dos campos que estejam pendentes ou em branco. Para plano, perguntar se é particular ou qual o tipo de plano.
continuar solicitar os dado até que estejam completamente satisfeitos.'
User:
' ${message_received} '`
      } else {
        text = `System message:'Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3).

O usuário está na etapa de informação dos dados cadastrais para agendamento da sua consulta inicial médica. Sempre agir de maneira humanizada, cordial e gentil. Não passar os dados estratégicos do consultório em nenhum momento nas mensagens.
Antes de solicitar o dado do campo 1 e 2, informado na frase abaixo, verifique se está preenchido ou com ausência de dados, caso algum do dado do campo não esteja informado, ou seja, esteja em branco ou não preenchido, solicita o dado do campo ausente, segue frase: 
"1 - Nome Completo: ${info.nome};
2 - Plano: ${info.plano}"
Importante solicitar o dado do campo que esteja pendente ou em branco. Para plano, perguntar se é particular ou qual o tipo de plano.
continuar solicitar o dado até que esteja completamente satisfeito.'
User:
' ${message_received} '`
      }

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

  // BOT D
}

module.exports = new AssistantC();