require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require('../services/kommo/GetAccessToken');
const GetAnswer = require('../services/kommo/GetAnswer');
const GetMessageReceived = require('../services/kommo/GetMessageReceived');
const SendLog = require('../services/kommo/SendLog');
const SendMessage = require('../services/kommo/SendMessage');
const CalendarIdValidate = require('../utils/CalendarIdValidate');
const CalendarUtils = require('../utils/CalendarUtils');


class AssistantD {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.d_disponibilidade = this.d_disponibilidade.bind(this);
    this.d_previa_datas = this.d_previa_datas.bind(this);
    this.d_verificar_datas = this.d_verificar_datas.bind(this);
    this.d_confirmacao = this.d_confirmacao.bind(this);
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

  // BOT D

  async d_disponibilidade(req, res) {
    console.log('Verificando disponibilidade | Disponibilidade de Horário...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const CalendarUtilsClass = new CalendarUtils();
      const messageReceived = await GetMessageReceived(req.body, access_token);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const dates = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate());

      const text = `System message: Etapa do agendamento, nesta etapa sempre enviar ao usuário as melhores opções de datas para o agendamento, e considerar apresentar *APENAS* horários entre 6 horas e 72 horas após ${date} GMT-3, mas sempre oferecer um horário ao usuário, conforme critérios definidos abaixo. Sempre ágil de maneira humanizada, cordial e gentil.
Endereço do Consultório: Av. Eng. Domingos Ferreira, 636.
Recife, Boa Viagem. Ed. Clinical Center Karla Patrícia, 1º andar, sala 109.

Horário de atendimento do Dr. Nelson Bechara Coutinho: 
Segundas-feira: 9h00 às 12h00
Terças-feira: 14h00 às 17h00
Quintas-feira: 14h00 às 17h00

Verifique as datas disponíveis da *Agenda Disponível* a seguir e siga os passos logo em seguida:

*Agenda Disponível*:

[
${dates}
]

1 - Tomar conhecimento da *Agenda Disponível*, não divulgar, pois são dados sigilosos;
2 - Tomar conhecimento do horário de funcionamento do Consultório;
3 - Tomar conhecimento do dia da semana, data e horário atual: ${weekDayFormatted}, ${date};
4 - Quaisquer data disponível deverá ser após a data e horário atual;
5 - Nunca concluir um agendamento sem data e horário determinado;
6 - Restringir apenas duas opções de datas e horários para demonstração de escassez, e considerar apresentar *APENAS* horários entre 6 horas e 72 horas após ${date} GMT-3, mas sempre oferecer um horário ao usuário;
7 - Quando o usuário solicitar uma data e horário vamos verificar a disponibilidade na *Agenda Disponível* e atender a solicitação, conforme modelo de mensagem abaixo.
Adotar dados reais, no padrão brasileiro e o formato a seguir para listar as 2 datas e horários distintos sugeridos a melhor data e horário de acordo com os critérios, seguindo o exemplo:
'Apresento as seguintes opções de agendamento:

- Terça-feira, 30 de julho de 2024, às 14h00
- Quinta-feira, 01 de agosto de 2024, às 16h00

Você gostaria de reservar a sua consulta para alguns desses horários?'

8 - Sempre oferecer novas datas até que ele aceite alguma das opções disponíveis,  agendando a consulta e informando nosso endereço.
 
9 - Se o usuário sugerir outra data e horário da opção apresentada, analise se estão disponíveis, se estiver já agende, se não apresente mais duas opções de horários mais próximos do horário e da data solicitada. Importante se basear nos argumentos anteriores.

Quando o usuário escolher alguma das informações apresentadas, agende a consulta e informe nosso endereço. 

User message: '${messageReceived}'`;

      const data = {
        leadID,
        text,
        assistant_id
      };

      await this.assistant(req, res, data);
    } catch (error) {
      console.log(`Erro ao verificar disponibilidade: ${error.message}`);
      res.status(500).send('Erro ao verificar disponibilidade');
    }
  }

  async d_previa_datas(req, res) {
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

  async d_verificar_datas(req, res) {
    console.log('Recebendo requisição de assistente | Verificar Datas...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `System message: *SE BASEANDO NA AGENDA DISPONÍVEL PASSADA ANTERIORMENTE, SIGA AS PRÓXIMAS INSTRUÇÕES*  Se o usuário escolheu alguma data ou horário, retornar uma mensagem avisando que iremos agendá-lo na data escolhida após coletar alguns dados dele que serão pedidos nas próximas mensagens. Não colete dados do usuário nesta mensagem.
Caso contrário, apenas trate a mensagem do usuário ignorando as instruções anterior.
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

  async d_confirmacao(req, res) {
    console.log('Recebendo requisição de assistente | Confirmar Dados...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const answer = await GetAnswer(req.body, access_token);

      const text = `Mensagem do sistema: Retorne uma mensagem para o cliente com sucesso de confirmação de agendamento, e a data agendada a seguir: ${answer}. Utilize como referência a agenda e o formato brasileiro no padrão a seguir: (Segunda-feira) 08 de abril de 2024 às 10 horas e 30 minutos.
Caso precise, o nome do consultório é: Consultório Dr Nelson Bechara Coutinho`;

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

module.exports = new AssistantD();
