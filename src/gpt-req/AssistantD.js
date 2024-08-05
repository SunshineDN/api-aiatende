require('dotenv').config();
const OpenAIController = require('../controllers/OpenAIController');
const GetAccessToken = require("../services/kommo/GetAccessToken");
const GetAnswer = require("../services/kommo/GetAnswer");
const GetLeadChannel = require('../services/kommo/GetLeadChannel');
const GetLeadInfoForBotC = require('../services/kommo/GetLeadInfoForBotC');
const GetMessageReceived = require("../services/kommo/GetMessageReceived");
const SendLog = require("../services/kommo/SendLog");
const SendMessage = require("../services/kommo/SendMessage");
const CalendarIdValidate = require('../utils/CalendarIdValidate');
const CalendarUtils = require('../utils/CalendarUtils');


class AssistantD {
  constructor() {
    this.assistant = this.assistant.bind(this);
    this.d_disponibilidade = this.d_disponibilidade.bind(this);
  }

  async assistant(req, res, data) {
    let access_token;
    try {
      console.log('Enviando para o assistente GPT...');
      access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);

      const { message } = await OpenAIController.generateMessage(data);

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

      const text = `System message:

EM HIPÓTESE ALGUMA DEVE TER ALGUM RETORNO CONFIRMANDO AGENDAMENTO, APENAS FORNECER DATAS.

Etapa do agendamento, nesta etapa sempre enviar ao usuário as melhores opções de datas para o agendamento, conforme critérios definidos na mensagem do sistema abaixo. Sempre ágil de maneira humanizada, cordial e gentil. 
Dia da semana, Data e Horário atual são
${weekDayFormatted}, ${date} GMT-3;

Endereço do Consultorio: Av. Eng. Domingos Ferreira, 636.
Recife, Boa Viagem. Ed. Clinical Center Karla Patrícia, 1º andar, sala 109.

Mensagem do sistema:
Horário dos Turnos:
Manhã: 9h00 às 12h00
Tarde: 14h00 às 17h00

Verifique as datas disponíveis da agenda a seguir e siga os passos logo em seguida:

Agenda com datas disponíveis:

[
${dates}
]

1 - Tomar conhecimento da *Agenda do Consultório*, não divulgar, pois são dados sigilosos;
2 - Tomar conhecimento do horário de funcionamento do Consultório;
3 - Tomar conhecimento do dia da semana, data e horário atual: ${weekDayFormatted}, ${date};
4 - Quaisquer data disponível deverá ser após a data horário e atual;
5 - Nunca concluir um agendamento sem data e horário determinado;
6 - Restringir apenas duas opções de datas e horários para demonstração escassez, e apresentar horários entre 12 horas e 72 horas da data e horário atual, mas sempre oferecer um horário ao usuário;
7 - Quando o lead solicitar uma data e horário vamos verificar a disponibilidade e atender a solicitação, conforme modelo de mensagem abaixo.
Adotar dados reais, no padrão brasileiro e o formato a seguir para listar as 2 datas e horários distintos sugeridos a melhor data e horário de acordo com os critérios, seguindo o exemplo:
'Apresento as seguintes opções de agendamento:

- Quinta-feira, 13 de junho de 2024, às 14h00
- Sexta-feira, 14 de junho de 2024, às 16h00

Você gostaria de reservar a sua consulta para alguns desses horários?'

8 - Sempre oferecer novas datas até que ele aceite alguma das opções disponível,  agendando a consulta e informando nosso endereço.
 
9 - Se o usuário sugerir outros dados e localização diferentes das opções disponíveis, analise se estão disponíveis, e envie mais duas opções. Baseando-se nos argumentos anteriores.
Quando o lead escolher alguma das informações apresentadas, agende a consulta e informe nosso endereço. 

User message:
${messageReceived}`;

      const data = {
        leadID,
        text,
        assistant_id
      }

      await this.assistant(req, res, data);
    } catch (error) {
      console.log(`Erro ao verificar disponibilidade: ${error.message}`);
      res.status(500).send('Erro ao verificar disponibilidade');
    }
  }
}

module.exports = new AssistantD();