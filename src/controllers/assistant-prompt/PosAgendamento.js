import styled from '../../utils/log/styledLog.js';
import { GetAccessToken } from '../../services/kommo/GetAccessToken.js';
import { GetAnswer } from '../../services/kommo/GetAnswer.js';
import { GetMessageReceived } from '../../services/kommo/GetMessageReceived.js';
import { GetUser } from '../../services/kommo/GetUser.js';
import { Communicator } from '../../utils/assistant-prompt/Communicator.js';
import { DifDates } from '../../utils/DifDates.js';

export default class PosAgendamento {

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

#Reagendar: Caso a resposta tenha a intenção de marcar a consulta ou data agendada para outra data.

#Desmarcar: Caso a resposta tenha intenção de desmarcar a consulta.

#Geral: Não condiz com os demais cenários.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra:" Exemplo: #Atendente `;

      Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  //Prompt
  static async intencao_falta(req, res) {
    styled.function('Prompt | BOT - PÓS AGENDAMENTO | Faltosos...');
    try {
      const access_token = GetAccessToken();
      const message_received = await GetMessageReceived(req.body, access_token);
      const answer = await GetAnswer(req.body, access_token);

      const text = `Confira a mensagem a seguir: '${answer}'. Agora analise a reposta do usuário: '${message_received}'.
Verifique abaixo qual das intenções mais se encaixa com a resposta do usuário.

#Reagendar: Caso o usuário queira dar continuidade em reagendamento.

#Perdido: Caso o usuário não queira mais manter contato com a clínica.

#Geral: Se não for nenhum dos cenários anteriores.

Retorne apenas o ID da intencão antecedido do #, por exemplo: #Geral`;
      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }
 
  //Assistente
  static async notificar_falta(req, res) {
    styled.function('Assistant | BOT - PÓS AGENDAMENTO | Faltosos...');
    try {
      const access_token = GetAccessToken();
      const message_received = await GetMessageReceived(req.body, access_token);

      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `System message: Retorne uma mensagem educada e informativa ao usuário informando que ele perdeu a sessão agendada. Inclua os seguintes pontos:

- Lembrete do compromisso que foi perdido (data e hora).
- Importância da sessão.
- Pedir desculpas pelo inconveniente e mostrar disposição para ajudar a reagendar.

Exemplo de mensagem:
'Olá Augêncio,

Notamos que você não pôde comparecer à sua sessão agendada conosco no dia 05/08/2024 10:00. Entendemos que imprevistos acontecem e gostaríamos de ajudar a remarcar essa sessão para um momento mais conveniente para você.

Por favor, entre em contato conosco para reagendarmos. Estamos à disposição para encontrar um horário que se encaixe melhor na sua agenda.

Agradecemos a sua compreensão e aguardamos seu retorno.'

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
  static async inicar_reagendamento(req, res) {
    styled.function('Assistente | BOT - PÓS AGENDAMENTO | Reagendamento...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const access_token = GetAccessToken();
      const message_received = await GetMessageReceived(req.body, access_token);

      const text = `System message: O usuário deseja reagendar. Retorne uma mensagem que iremos continuar com o reagendamento dele e fornecer as datas em breve.
User message: '${message_received}'`;

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
}