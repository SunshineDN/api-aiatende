import styled from '../../utils/log/styledLog.js';
import { GetAccessToken } from '../../services/kommo/GetAccessToken.js';
import { GetMessageReceived } from '../../services/kommo/GetMessageReceived.js';
import { Communicator } from '../../utils/assistant-prompt/Communicator.js';

export default class Global {
  
  //Prompt
  static async prompt(req, res) {
    styled.function('Requisição de prompt | Only Prompt (Apenas Prompt)...');
    try {
      const access_token = GetAccessToken();
      const message_received = await GetMessageReceived(req.body, access_token);

      await Communicator.prompt(req, res, message_received);
    } catch (error) {
      styled.error(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  //Assistente
  static async assistant(req, res) {
    styled.function('Requisição de assistente | Only Assistant (Apenas Assistente)...');
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

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para a assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para a assistente');
    }
  }

};