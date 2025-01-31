import styled from '../../utils/log/styled.js';
import { GetAccessToken } from '../../services/kommo/GetAccessToken.js';
import { GetAnswer } from '../../services/kommo/GetAnswer.js';
import { GetMessageReceived } from '../../services/kommo/GetMessageReceived.js';
import { Communicator } from '../../utils/assistant-prompt/Communicator.js';

export default class Cutucada {

  // Prompt
  static async intencao(req, res) {
    styled.function('Prompt | BOT - Cutucada | Inteção...');
    try {
      const access_token = GetAccessToken();

      const message_received = await GetMessageReceived(req.body, access_token);
      const answer = await GetAnswer(req.body, access_token);

      const text = `Aja como um analista de marketing experiente e veja a seguinte mensagem: '${answer}'. E analise a resposta do usuário: '${message_received}'.
Identifique em qual das situações abaixo melhor se encaixa a intenção do usuário:

#Perdido: Se o usuário estiver com intenção de encerrar a conversa, ou não quer continuar falando.

#Aguardar: Se o usuário estiver sem poder responder no momento, ou está ocupado, ou está querendo responder depois.

#Continuar: Quando a resposta do usuário quer responder uma mensagem da Clínica. 

#Geral: os demais assuntos.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra:" Exemplo: #Geral'`;
      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  // Prompt
  static async gerar_perguntas(req, res) {
    styled.function('Prompt | BOT - Cutucada | Gerar Perguntas...');
    try {
      const access_token = GetAccessToken();

      const answer = await GetAnswer(req.body, access_token);

      const text = `O usuário está há algum tempo sem responder, faça uma pergunta para o usuário para ele retomar a conversa, aqui vai alguns exemplos: 'Vamos continuar?', 'Estou te aguardando', 'Continua ai?', 'Ainda interessado?'

Observe a mensagem enviada anteriormente para este usuário: '${answer}'

Pode utilizar alguns dos exemplos, mas tente produzir sempre mensagens inovadoras. Retorne apenas a pergunta para o usuário.`;
      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  // Assistente
  static async assistente(req, res) {
    styled.function('Assistente | BOT - Cutucada | Assistente...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = 'System message: Retorne uma mensagem para continuar conversando, sem ser sobre agendar, para o usuário sobre o assunto que estava ocorrendo nas últimas mensagens.';

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