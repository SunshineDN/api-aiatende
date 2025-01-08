import styled from '../../utils/log/styledLog.js';
import { GetAccessToken } from '../../services/kommo/GetAccessToken.js';
import { GetAnswer } from '../../services/kommo/GetAnswer.js';
import { GetMessageReceived } from '../../services/kommo/GetMessageReceived.js';
import { GetUser } from '../../services/kommo/GetUser.js';
import { Communicator } from '../../utils/assistant-prompt/Communicator.js';

export default class Confirmacao {

  //Prompt
  static async intencao(req, res) {
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

      const text = `System message: 'Retorne apenas uma mensagem para o usuário para a confirmação da sua ida no dia: ${scheduled_date_value}. Aqui vai um exemplo de mensagem: "Lembre-se que seu compromisso conosco é AMANHÃ

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

      const text = `System message: Usuário passou 2 horas sem responder a mensagem anterior, retorne apenas uma mensagem dizendo que é muito importante que ele confirme a presença no dia marcado. Exemplo de mensagem: "Olá, Tudo bem? Ainda não recebemos a confirmação da sua presença amanhã.
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

      const text = `System message: Usuário passou mais 2 horas sem responder a mensagem anterior, retorne apenas uma mensagem pedindo para ele confirmar sua presença para o dia: ${scheduled_date_value}. Exemplo de mensagem: "Gostaria de lembrar que o processo de confirmação da sua presença é muito importante. Temos que nos planejar adequadamente. Por favor, confirme sua presença respondendo agora esta mensagem.

Dia e Hora:
19/08/2024 às 14:30

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

      const text = `System message: Usuário confirmou a mensagem anterior e a presença dele será *HOJE*. Retorne apenas uma mensagem pedindo para ele confirmar a presença. Exemplo de mensagem: "É *HOJE*!

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