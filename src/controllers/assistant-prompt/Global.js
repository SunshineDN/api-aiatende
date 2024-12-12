const GetAccessToken = require('../../services/kommo/GetAccessToken');
const GetMessageReceived = require('../../services/kommo/GetMessageReceived');
const Communicator = require('../../utils/assistant-prompt/Communicator');
const styled = require('../../utils/log/styledLog');

class Global {
  
  //Prompt
  static async prompt(req, res) {
    styled.function('Requisição de prompt | Only Prompt (Apenas Prompt)...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
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

};

module.exports = Global;
