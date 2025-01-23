
const OpenAIController = require('../controllers/OpenAIController.js');
const GetAccessToken = require('../services/kommo/GetAccessToken.js');
const GetAnswer = require('../services/kommo/GetAnswer.js');
const GetMessageReceived = require('../services/kommo/GetMessageReceived.js');
const GetUser = require('../services/kommo/GetUser.js');
const SendLog = require('../services/kommo/SendLog.js');
const SendMessage = require('../services/kommo/SendMessage.js');
const CalendarIdValidate = require('../utils/calendar/CalendarIdValidate.js');
const CalendarUtils = require('../utils/calendar/CalendarUtils.js');


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

  // BOT D

  async d_disponibilidade(req, res) {
    console.log('Verificando disponibilidade | Disponibilidade de Horário...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const access_token = GetAccessToken();
      const messageReceived = await GetMessageReceived(req.body, access_token);
      const user = await GetUser(req.body, false, access_token);
      const CalendarUtilsClass = new CalendarUtils();

      
      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();
      
      const nameDoctor = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Dentista'
      )[0];
      let dates;

      try {
        dates = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não encontrado'));
      } catch {
        dates = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não encontrado'));
      }

      const text = `System message: Adotar Dia da semana, Data e Horário atual são ${weekDayFormatted}, ${date} GMT-3.

Endereço da Clínica: Av. Bernardo Vieira de Melo, 2418, Piedade - PE. Próximo ao Banco Bradesco.

Horário de atendimento da Clínica Dental Santé: 
Segunda à Sexta: 08h00 às 20h00
Sábado: 08h00 às 13h00

Etapa do pré-agendamento, nesta etapa sempre enviar ao usuário as melhores opções de datas para o pré-agendamento, restringindo apenas duas opções de datas e horários para demonstração de escassez, e considerar apresentar *APENAS* horários entre 6 horas e 72 horas após ${date} GMT-3, mas sempre oferecer um horário ao usuário, conforme critérios definidos abaixo. Sempre ágil de maneira humanizada, cordial e gentil.

Verifique as datas disponíveis da agenda a seguir e siga os passos logo em seguida:

*Agenda Disponível*:

[
${dates}
]

*Nunca ofereça datas muito próximas ao horário atual*
1 - Tomar conhecimento da *Agenda Disponível*, não divulgar, pois são dados sigilosos;
2 - Tomar conhecimento do horário de funcionamento da Clínica;
3 - Tomar conhecimento do dia da semana, data e horário atual: ${weekDayFormatted}, ${date};
4 - Quaisquer data disponível deverá ser após a data e horário atual;
5 - Nunca concluir o pré-agendamento sem data e horário determinado;
6 - Restringir apenas duas opções de datas e horários para demonstração de escassez, e considerar apresentar *APENAS* horários entre 6 horas e 72 horas após ${date} GMT-3, mas sempre oferecer um horário ao usuário;
7 - Quando o usuário solicitar uma data e horário vamos verificar a disponibilidade na *Agenda Disponível* e atender a solicitação, conforme modelo de mensagem abaixo.
Adotar dados reais, no padrão brasileiro e o formato a seguir para listar as 2 datas e horários distintos sugeridos a melhor data e horário de acordo com os critérios, seguindo o exemplo:
'Apresento as seguintes opções para o pré-agendamento:

- Terça-feira, 30 de julho de 2024, às 14h00
- Quinta-feira, 01 de agosto de 2024, às 16h00

Você gostaria de reservar a sua consulta para alguns desses horários?'

8 - Sempre oferecer novas datas até que ele aceite alguma das opções disponíveis
 
9 - Se o usuário sugerir outra data e horário das opções apresentadas, analise se estão disponíveis, se estiver já faça o pré-agendamento, se não apresente mais duas opções de horários mais próximos do horário e da data solicitada. Importante se basear nos argumentos anteriores.

Quando o usuário escolher alguma das informações apresentadas, faça o pré-agendamento da consulta e informe que apenas no final do agendamento que será confirmada a disponibilidade da agenda, após ele fornecer os dados que serão solicitados nas próximas mensagens. 

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
      const access_token = GetAccessToken();
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
      const access_token = GetAccessToken();
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `System message: *SE BASEANDO NA AGENDA DISPONÍVEL PASSADA ANTERIORMENTE, SIGA AS PRÓXIMAS INSTRUÇÕES* Adote o dia da semana, data e hora atual: '${weekDayFormatted}, ${date}'. Se o usuário escolheu alguma data ou horário, retornar uma mensagem avisando que iremos analisar a data escolhida (deixando de maneira clara qual é a data e o horário escolhido), após coletar alguns dados dele que serão solicitados nas próximas mensagens. Não colete dados do usuário ou agende nesta mensagem.
Caso contrário, apenas trate a mensagem do usuário ignorando as instruções anteriores.

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
      const access_token = GetAccessToken();
      const answer = await GetAnswer(req.body, access_token);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `Mensagem do sistema: Adote o dia da semana, data e hora atual: '${weekDayFormatted}, ${date}'. Retorne uma mensagem para o cliente com sucesso de confirmação de agendamento, e a data agendada a seguir: ${answer}. Utilize como referência a agenda e o formato brasileiro no padrão a seguir: (Segunda-feira) 08 de abril de 2024 às 10 horas e 30 minutos.
Caso precise, o nome da clínica é: Clínica Dental Santé`;

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
