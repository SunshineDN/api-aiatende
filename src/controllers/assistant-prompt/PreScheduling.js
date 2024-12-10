const styled = require('../../utils/log/styledLog');
const Communicator = require('../../utils/assistant-prompt/Communicator');
const GetAccessToken = require('../../services/kommo/GetAccessToken');
const CalendarUtils = require('../../utils/calendar/CalendarUtils');
const GetUser = require('../../services/kommo/GetUser');
const CalendarIdValidate = require('../../utils/calendar/CalendarIdValidate');
const GetAnswer = require('../../services/kommo/GetAnswer');
const SetActualDateHour = require('../../services/kommo/SetActualDateHour');
const GetMessageReceived = require('../../services/kommo/GetMessageReceived');

class PreScheduling {

  //Prompt
  static async intencao(req, res) {
    styled.function('Prompt | BOT - Pré Agendamento | Intenção...');
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
      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  //Prompt
  static async verificar_confirmacao(req, res) {
    styled.function('Prompt | BOT - Pré Agendamento | Verificação de confirmação...');
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
      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  //Prompt
  static async confirmar_data(req, res) {
    styled.function('Prompt | BOT - Pré Agendamento | Confirmação de datas...');
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
      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }
  
  //Prompt
  static async verificar_agenda_especialista(req, res) {
    styled.function('Prompt | BOT - Pré Agendamento | Verificação de agenda do especialista...');
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

      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  //Assistente
  static async disponibilidade(req, res) {
    styled.function('Assistente | BOT - Pré Agendamento | Disponibilidade de Horário...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const messageReceived = await GetMessageReceived(req.body, access_token);
      const user = await GetUser(req.body, false, access_token);
      const CalendarUtilsClass = new CalendarUtils(req.body.account.id);

      
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
        dates = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não encontrado', req.body.account.id));
      } catch {
        dates = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não encontrado', req.body.account.id));
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

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao verificar disponibilidade: ${error.message}`);
      res.status(500).send('Erro ao verificar disponibilidade');
    }
  }

  //Assistente
  static async previa_datas(req, res) {
    styled.function('Assistente | BOT - Pré Agendamento | Prévia de Datas...');
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

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para a assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para a assistente');
    }
  }

  //Assistente
  static async verificar_datas(req, res) {
    styled.function('Assistente | BOT - Pré Agendamento | Verificar Datas...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
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

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para a assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para a assistente');
    }
  }

  //Assistente
  static async confirmacao(req, res) {
    styled.function('Assistente | BOT - Pré Agendamento | Confirmar Dados...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
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

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para a assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para a assistente');
    }
  }
};

module.exports = PreScheduling;
