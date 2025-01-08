import styled from '../../utils/log/styledLog.js';
import { GetAccessToken } from '../../services/kommo/GetAccessToken.js';
import { GetAnswer } from '../../services/kommo/GetAnswer.js';
import { GetMessageReceived } from '../../services/kommo/GetMessageReceived.js';
import { GetUser } from '../../services/kommo/GetUser.js';
import { Communicator } from '../../utils/assistant-prompt/Communicator.js';
import { DifDates } from '../../utils/DifDates.js';

export default class Confirmacao {

  //Prompt
  static async intencao(req, res) {
    styled.function('Prompt | BOT - PÓS AGENDAMENTO | Intenção...');
    try {
      const access_token = GetAccessToken();
      const answer = await GetAnswer(req.body, access_token);
      const messageReceived = await GetMessageReceived(req.body, access_token);

      const text = `Considere que você esteja analisando a intenção de uma frase digitada por um usuário em um chatbot.
Analise a mensagem: '${answer}' e veja em quais das situações abaixo encaixa a intenção para a resposta: '${messageReceived}'.
#Confirmação: A resposta tem intenção de confirmar ou continuar com o agendamento.

#Reagendar: Caso a resposta tenha a intenção de marcar ou data agendada para outra data.

#Desmarcar: Caso a resposta tenha intenção de desmarcar.

#Geral: Não condiz com os demais cenários.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra:" Exemplo: #Atendente `;

      Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  //Prompt
  static async intencao_presenca(req, res) {
    styled.function('Prompt | BOT - Confirmação | Intenção - Esteira de Confirmações...');
    try {
      const access_token = GetAccessToken();

      const answer = await GetAnswer(req.body, access_token);
      const message_received = await GetMessageReceived(req.body, access_token);

      const text = `Analise a mensagem a seguir: ${answer} e veja em quais das situações abaixo encaixa a intenção da resposta do usuário: '${message_received}'.

#Confirmou: Usuário confirmou a presença.

#NãoConfirmou: Usuário não confirmou a presença.

#Geral: Para os demais assuntos.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra:" Exemplo: #Geral'`;

      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  //Assistente
  static async confirmar_presenca(req, res) {
    styled.function('Assistente | BOT - PÓS AGENDAMENTO | Confirmar Vinda...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const access_token = GetAccessToken();
      const user = await GetUser(req.body, false, access_token);
      const scheduleDate = user?.custom_fields_values?.filter(field => field.field_name === 'Event Start')[0];
      const scheduleDateValue = scheduleDate?.values[0]?.value;

      // const DifDates = require('../../utils/DifDates');

      const { diferencaDias, diferencaHoras } = DifDates(scheduleDateValue);
      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `System message: O dia da semana, data e hora atual são; '${weekDayFormatted}, ${date}' Envie uma mensagem para o usuário avisando sobre a data de agendamento: '${scheduleDateValue}'. Adicione também que faltam ${diferencaDias} dia(s) e ${diferencaHoras} hora(s) para a consulta.`;

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para a assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  //Assistente
  static async _24h_1(req, res) {
    styled.function('Assistente | BOT - Confirmação | Esteira de Confirmação 24 horas 1/3...');
    try {
      const access_token = GetAccessToken();
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const user = await GetUser(req.body, false, access_token);

      const scheduled_date = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Event Start'
      )[0];
      const scheduled_date_value = scheduled_date?.values[0]?.value;

      const text = `System message: 'Retorne apenas uma mensagem para o usuário para a confirmação da sua ida para a clínica no dia: ${scheduled_date_value}. Aqui vai um exemplo de mensagem: "Lembre-se do compromisso da sua consulta odontológica com *DENTISTA* é AMANHÃ

Dia e Hora:
19/08/2024 às 14:30

Não esqueça de confirmar sua presença, respondendo esta mensagem agora!

Confirmado?" '`;

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
  static async _24h_2(req, res) {
    styled.function('Assistente | BOT - Confirmação | Esteira de Confirmação 24 horas 2/3...');
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

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para a assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para a assistente');
    }
  }

  //Assistente
  static async _24h_3(req, res) {
    styled.function('Assistente | BOT - Confirmação | Esteira de Confirmação 24 horas 3/3...');
    try {
      const access_token = GetAccessToken();
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const user = await GetUser(req.body, false, access_token);

      const scheduled_date = user?.custom_fields_values?.filter(
        (field) => field.field_name === 'Event Start'
      )[0];
      const scheduled_date_value = scheduled_date?.values[0]?.value;

      const text = `System message: Usuário passou mais 2 horas sem responder a mensagem anterior, retorne apenas uma mensagem pedindo para ele confirmar sua presença para o dia: ${scheduled_date_value}. Exemplo de mensagem: "Gostaria de lembrar que o processo de confirmação da consulta é muito importante. Temos que planejar adequadamente seu atendimento. Por favor, confirme sua presença respondendo agora esta mensagem.

Dia e Hora:
19/08/2024 às 14:30

Local: Av. Bernardo Vieira de Melo, 2418. Piedade, Jaboatão dos Guararapes - PE. (Próximo ao Banco Bradesco)

Confirmado?"`;

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
  static async _3h_1(req, res) {
    styled.function('Assistente | BOT - Confirmação | Esteira de Confirmação 3 horas 1/2...');
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

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para a assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para a assistente');
    }
  }

  //Assistente
  static async _3h_2(req, res) {
    styled.function('Assistente | BOT - Confirmação | Esteira de Confirmação 3 horas 2/2...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = 'System message: Usuário passou 30 minutos sem responder a mensagem anterior, retorne apenas uma mensagem perguntando se pode confirmar a presença dele.';

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