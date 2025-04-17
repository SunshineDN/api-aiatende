import styled from '../../utils/log/styled.js';
import { GetAccessToken } from '../../services/kommo/GetAccessToken.js';
import { GetAnswer } from '../../services/kommo/GetAnswer.js';
import { GetMessageReceived } from '../../services/kommo/GetMessageReceived.js';
import { GetUser } from '../../services/kommo/GetUser.js';
import { CalendarIdValidate } from '../../utils/calendar/CalendarIdValidate.js';
import { CalendarUtils } from '../../utils/calendar/CalendarUtils.js';
import { Communicator } from '../../utils/assistant-prompt/Communicator.js';

export default class Agendamento {

  //Prompt
  static async intencao(req, res) {
    styled.function('Prompt | BOT - Agendamento | Intenção...');
    try {
      const access_token = GetAccessToken();
      const answer = await GetAnswer(req.body, access_token);
      const message_received = await GetMessageReceived(req.body, access_token);
      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

      const text = `Aja como um especialista em análise de dados para clínicas odontológicas. Considere que você esteja analisando a intenção de resposta digitada por um usuário em um chatbot. A data e hora atual são: ${date}. Analise a mensagem da clínica: '${answer}' e veja em quais das situações abaixo encaixa a intenção da resposta digitada pelo usuário: '${message_received}'.

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
    styled.function('Prompt | BOT - Agendamento | Verificar Confirmação...');
    try {
      const access_token = GetAccessToken();
      const answer = await GetAnswer(req.body, access_token);
      
      const text = `Seja como especialista em agendamento de consultas. Considere que você está analisando a intenção de uma frase digitada pela clínica em um chatbot, e analise em quais das situações abaixo estão inseridas a intenção da frase digitada: '${answer}'

#IndefiniteDate: Se na frase digitada pela clínica estiver como opções de agendamento, sugestões de dados de agendamento ou informando preferências de dados de agendamento, conforme exemplos: 
' 1- Com base na disponibilidade e no horário de funcionamento da clínica, as opções de agendamento para o dia 15 de junho de 2024, no período da tarde, são as seguintes:
- Terça-feira, 15 de junho de 2024, às 16:00
 Esses dados e horários estão disponíveis para a sua consulta inicial. Gostaria de reservar para esse horário? 

2- Gostaria de oferecer as seguintes opções de agendamento: - Segunda-feira (06/10/2024) às 14h00, ou - Terça-feira (06/11/2024) às 10h00;
 as opções disponíveis para agendamento são:
- Quinta-feira (13/06/2024) às 14h00
- Sexta-feira (14/06/2024) às 16h00
 
3- Posso reservar a sua consulta para um desses horários?;
tenho disponibilidade nos seguintes horários à tarde:
- Terça-feira, 11 de junho de 2024, às 14:00
- Terça-feira, 11 de junho de 2024, às 16:00
Qual dessas fica melhor para você?;

 4- Os dados disponíveis para agendamento são:
- Quinta-feira (13/06/2024) às 08h00
- Quinta-feira (13/06/2024) às 09h00.
 Por favor, confirme se uma dessas opções é adequada para você, e em seguida, providenciaremos o agendamento.

5- sabemos que precisou reagendar sua consulta. Não se preocupe, estamos aqui para ajudar.
As opções disponíveis para o reagendamento são:
- Quarta-feira, 19 de junho de 2024, às 10:00
- Quinta-feira, 20 de junho de 2024, às 15:00
Por gentileza, informe-nos quais essas opções funcionam melhor para você.'

#ConfirmDate: Se na frase digitada pela clínica afirmou que a consulta está agendada ou confirmada, conforme exemplo: 'Perfeito! Sua consulta está agendada para terça-feira, 11/06/2024, às 16h na Clínica Dental Santé, Av. Bernardo Vieira de Melo, 2418, Piedade - PE. Estamos ansiosos para recebê-lo'

#demais: Se a frase digitada pela clínica não se enquadrar como uma consulta agendada ou aberta, nem opções de agendamento.  

Responda apenas com o ID correspondente da opção, que segue este padrão: "#palavra:" Exemplo: #IndefiniteDate`;

      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  //Assistente
  static async form_join(req, res) {
    styled.function('Assistant | BOT - Agendamento | Agendamento pelo Formulário...');
    try {
      const access_token = GetAccessToken();
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const user = await GetUser(req.body, true, access_token);
      const username = user?.contact?.name || 'Não informado';

      const birthday_field = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Data de Nascimento (Texto)'
      )[0];
      const birthday = birthday_field?.values[0]?.value || 'Não informado';

      const neighborhood_field = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Bairro'
      )[0];
      const neighborhood = neighborhood_field?.values[0]?.value || 'Não informado';

      const scheduled_date_field = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Data escolhida'
      )[0];
      const scheduled_date = scheduled_date_field?.values[0]?.value || 'Não informado';

      const specialist_field = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Profissional'
      )[0];
      const specialist = specialist_field?.values[0]?.value || 'Dentistas da Equipe';

      const text = `O usuário abaixo foi diretamente agendado pela recepção como um usuário novo, ou é um usuário reagendado e será atualizado os dados. Seguem os dados do usuário:
Nome Completo: ${username}
Data de Nascimento: ${birthday}
Bairro: ${neighborhood}
Data do agendamento: ${scheduled_date}
Especialista: ${specialist}

Considerar que o usuário passou por todas as etapas para fazer o primeiro agendamento ou reagendamento.`;

      const data = {
        leadID,
        text,
        assistant_id
      };

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  //Assistente
  static async disponibilidade_horario(req, res) {
    styled.function('Verificando disponibilidade | BOT - Agendamento | Disponibilidade de Horário...');
    try {
      const access_token = GetAccessToken();
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const CalendarUtilsClass = new CalendarUtils();

      const message_received = await GetMessageReceived(req.body, access_token);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const user = await GetUser(req.body, false, access_token);
      const nameDoctor = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Profissional'
      )[0];
      let dates;

      try {
        dates = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não encontrado'));
      } catch {
        dates = await CalendarUtilsClass.listAvailableDate(CalendarIdValidate(nameDoctor?.values[0]?.value || 'Não encontrado'));
      }

      let specialist;
      if (nameDoctor?.values[0]?.value === 'Dra. Juliana Leite') {
        specialist = 'Dra. Juliana Leite';
      } else if (nameDoctor?.values[0]?.value === 'Dra. Lucília Miranda') {
        specialist = 'Dra. Lucília Miranda';
      } else {
        specialist = 'Dentistas da Equipe';
      }

      const text = `System message: Adotar o dia e hora atual: ${weekDayFormatted}, ${date} GMT-3. *APENAS CONSIDERE A AGENDA DISPONÍVEL ATUAL. DESCONSIDERE QUALQUER OUTRA AGENDA PASSADA ANTERIORMENTE*
Etapa de confirmação do agendamento, o usuário passou pelo pré-agendamento porém a data escolhida anteriormente não está disponível. Nesta etapa sempre enviar ao usuário duas opções de horários mais próximos do horário e da data solicitada, conforme critérios definidos abaixo. Sempre ágil de maneira humanizada, cordial e gentil.

Endereço da Clínica: Av. Bernardo Vieira de Melo, 2418, Piedade - PE. Próximo ao Banco Bradesco.

Especialista do Agendamento: ${specialist};

Horário de atendimento da Dra. Juliana Leite: 
Segunda à Quinta: 10h00 às 18h00
Sexta: 10h00 às 13h00

Horário de atendimento da Dra. Lucília Miranda:
Quarta: 08h00 às 18h00
Sábado: 08h00 às 13h00

Horário de atendimento dos demais dentistas da equipe:
Segunda à Sexta: 08h00 às 20h00
Sábado: 08h00 às 13h00

Conforme a disponibilidade na *Agenda Disponivel Atual* abaixo.

Verifique APENAS as datas disponíveis da *Agenda Disponível Atual* abaixo e siga os passos logo em seguida:

*Agenda Disponível Atual*:

[
${dates}
]

1 - Tomar conhecimento da *Agenda Disponível Atual*, não divulgar, pois são dados sigilosos;
2 - Tomar conhecimento do horário de funcionamento da Clínica;
3 - Tomar conhecimento do dia da semana, data e horário atual: ${weekDayFormatted}, ${date};
4 - Quaisquer data disponível deverá ser após a data e horário atual;
5 - Nunca concluir o agendamento sem data e horário determinado;
6 - Restringir apenas duas opções de datas e horários para demonstração de escassez.
7 - Quando o usuário solicitar uma data e horário vamos verificar a disponibilidade na *Agenda Disponível Atual* e atender a solicitação, conforme modelo de mensagem abaixo.
Adotar dados reais, no padrão brasileiro e o formato a seguir para listar as 2 datas e horários distintos sugeridos a melhor data e horário de acordo com os critérios, seguindo o exemplo:
'Apresento as seguintes opções para o agendamento:

- Terça-feira, 30 de julho de 2024, às 14h00
- Quinta-feira, 01 de agosto de 2024, às 16h00

Você gostaria de reservar a sua consulta para alguns desses horários?'

8 - Sempre oferecer novas datas listadas na *Agenda Disponível Atual* até que ele aceite alguma das opções disponíveis
 
9 - Se o usuário sugerir outra data e horário das opções apresentadas, analise se estão disponíveis consultando a *Agenda Disponível Atual*, se estiver já faça o agendamento, se não apresente mais duas opções de horários mais próximos do horário e da data solicitada. Importante se basear nos argumentos anteriores.

Quando o usuário escolher alguma das informações apresentadas, faça o agendamento da consulta e informe que apenas no final do agendamento que será confirmada a disponibilidade da agenda.

User message: '${message_received}'`;

      const data = {
        leadID,
        text,
        assistant_id
      };

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao verificar disponibilidade de horário: ${error.message}`);
      res.status(500).send('Erro ao verificar disponibilidade de horário');
    }
  }

  //Assistente
  static async verificar_datas(req, res) {
    styled.function('Recebendo requisição de assistente | Verificar Datas...');
    try {
      const access_token = GetAccessToken();
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `System message: *SE BASEANDO NA AGENDA DISPONÍVEL PASSADA ANTERIORMENTE, SIGA AS PRÓXIMAS INSTRUÇÕES*  Se o usuário escolheu alguma data ou horário, retornar uma mensagem avisando que iremos agendar a data escolhida. Caso contrário, apenas trate a mensagem do usuário ignorando as instruções anteriores.

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
}