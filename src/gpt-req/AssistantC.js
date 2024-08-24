require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const TextToSpeech = require('../services/gpt/TextToSpeech');
const GetAccessToken = require('../services/kommo/GetAccessToken');
const GetLeadChannel = require('../services/kommo/GetLeadChannel');
const GetLeadInfoForBotC = require('../services/kommo/GetLeadInfoForBotC');
const GetMessageReceived = require('../services/kommo/GetMessageReceived');
const SendLog = require('../services/kommo/SendLog');
const SendMessage = require('../services/kommo/SendMessage');


class AssistantC {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.c_previa_dados = this.c_previa_dados.bind(this);
    this.c_dados_cadastrais = this.c_dados_cadastrais.bind(this);
    this.c_split_dados = this.c_split_dados.bind(this);
    this.c_verifica_dados = this.c_verifica_dados.bind(this);
    this.c_listar_especialidades = this.c_listar_especialidades.bind(this);
    this.c_verificar_especialista = this.c_verificar_especialista.bind(this);
  }

  async assistant(req, res, data) {
    let access_token;
    try {
      console.log('Enviando para o assistente GPT...');
      access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      await TextToSpeech(req.body, access_token);
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

  // BOT C

  async c_previa_dados(req, res) {
    console.log('Recebendo requisição de assistente | Previa Dados...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const data = {
        leadID,
        text: message_received,
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
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const channel = await GetLeadChannel(req.body, access_token);
      const message_received = await GetMessageReceived(req.body, access_token);
      console.log('Channel:', channel);
      let text;

      if (channel === '03 - REDE SOCIAL') {
        text = `Os dados cadastrais são: Nome completo, data de nascimento, bairro e telefone.
Observe os dados cadastrais fornecidos pelo usuário '${message_received}' e avalie se está faltando algum dos dados cadastrais. Informe ao usuário o dado faltante e retornando uma mensagem pedindo o dado faltante para prosseguir no cadastro. Caso tenha todos os dados cadastrais, retorne uma mensagem para o usuário perguntando se os dados estão corretos.`;
      } else {
        text = `Os dados cadastrais são: Nome completo, data de nascimento e bairro. 
Observe os dados cadastrais fornecidos pelo usuário '${message_received}' e avalie se está faltando algum dos dados cadastrais. Informe ao usuário o dado faltante e retornando uma mensagem pedindo o dado faltante para prosseguir no cadastro. Caso tenha todos os dados cadastrais, retorne uma mensagem para o usuário perguntando se os dados estão corretos.`;
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

      if (channel === '03 - REDE SOCIAL') {
        text = `System message: Aja como um analista de dados cadastrais experiente. Nestes dois textos abaixo, analise cuidadosamente os campos para extrair o dado de nome completo, data de nascimento, bairro e telefone.

*Utilize somente dados que estejam nos textos. Agora, extraia os dados: nome completo, data de nascimento e bairro. Separado apenas com o valor do campo, sem informar o identificador de cada campo, cada campo deve terminar com um ponto e vírgula. Se no texto não existir a informação do campo, retornar apenas o id #ausencia`;
      } else {
        text = `System message: Aja como um analista de dados cadastrais experiente. Nestes dois textos abaixo, analise cuidadosamente os campos para extrair o dado de nome completo, data de nascimento e bairro.

*Utilize somente dados que estejam nos textos. Agora, extraia os dados: nome completo, data de nascimento e bairro. Separado apenas com o valor do campo, sem informar o identificador de cada campo, cada campo deve terminar com um ponto e vírgula. Se no texto não existir a informação do campo, retornar apenas o id #ausencia`;
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

      if (channel === '03 - REDE SOCIAL') {
        text = `System message:'Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife e (GMT-3).

Dados existentes:
"1 - Nome Completo: ${info.nome}
2 - Data de nascimento: ${info.nascimento}
3 - Bairro: ${info.bairro}
4 - Telefone: ${info.telefone}"

O usuário entrou na etapa de informação dos dados pessoais para finalizar o agendamento da sua consulta inicial odontológica. Sempre agir de maneira humanizada, cordial e gentil. Não passar os dados estratégicos da clínica em nenhum momento nas mensagens.
Antes de solicitar os dados, verifique se estão preenchidos em dados existentes, caso algum do dado do campo não esteja informado, ou seja, esteja em branco ou não preenchido, solicita o dado do campo ausente, segue frase:

“ Favor informar os dados para finalizar o agendamento da sua consulta inicial médica:
1 - Nome Completo:
2 - Data de nascimento
3 - Bairro 
4 - Telefone "

Importante solicitar os dados do campo que esteja pendente ou em branco. Plano de saúde ou convênio médico, perguntar se é particular ou qual o tipo de plano.
continuar solicitando o dado até que esteja completamente satisfeito.'
User message: '${message_received}'`;
      } else {
        text = `System message:'Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife e (GMT-3).

Dados existentes:
"1 - Nome Completo: ${info.nome}
2 - Data de nascimento: ${info.nascimento}
3 - Bairro: ${info.bairro}"

O usuário entrou na etapa de informação dos dados pessoais para finalizar o agendamento da sua consulta inicial odontológica. Sempre agir de maneira humanizada, cordial e gentil. Não passar os dados estratégicos da clínica em nenhum momento nas mensagens.
Antes de solicitar os dados, verifique se estão preenchidos em dados existentes, caso algum do dado do campo não esteja informado, ou seja, esteja em branco ou não preenchido, solicita o dado do campo ausente, segue frase:

“ Favor informar os dados para finalizar o agendamento da sua consulta inicial médica:
1 - Nome Completo
2 - Data de nascimento
3 - Bairro "

Importante solicitar os dados do campo que esteja pendente ou em branco. Continuar solicitando o dado até que esteja completamente satisfeito.'

User message: '${message_received}'`;
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

  async c_listar_especialidades(req, res) {
    console.log('Recebendo requisição de assistente | Listar Especialidades...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `System message: 'Agora estamos na etapa de solicitar a especialista para a *CONSULTA INICIAL*. Temos os dados do usuário e o último passo antes do agendamento final é saber qual especialidade ele vai querer. Temos 3 opções para listar e o usuário escolher para sua *CONSULTA INICIAL*, segue as opções:

“ 1 - Dentistas da Equipe | *Sem Custo*

2 - Dra. Juliana Leite | Reabilitação e Estética - *R$ 120,00*

3 - Odontopediatra | Crianças até 12 anos - *R$ 99,00* ”

Retorne uma mensagem para o usuário escolher uma das 3 opções listadas acima.'

User message: '${message_received}'`;

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

  async c_verificar_especialista(req, res) {
    console.log('Recebendo requisição de assistente | Verificar Especialista...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const channel = await GetLeadChannel(req.body, access_token);
      console.log('Channel:', channel);

      const message_received = await GetMessageReceived(req.body, access_token);

      const text = `System message: 'Analise a escolha da especialista para a *CONSULTA INICIAL* que o usuário fez e retorne uma mensagem listando a opção e perguntando se ele confirma a escolha. Caso contrário, peça novamente para o usuário escolher uma das 3 opções listadas abaixo:

“ 1 - Dentistas da Equipe | *Sem Custo*

2 - Dra. Juliana Leite | Reabilitação e Estética - *R$ 120,00*

3 - Odontopediatra | Crianças até 12 anos - *R$ 99,00* ” '

User message: '${message_received}'`;

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
}

module.exports = new AssistantC();
