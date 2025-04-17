import styled from '../../utils/log/styled.js';
import GlobalServices from '../../services/openaiIntegration/GlobalServices.js';

export default class GlobalController {

  static async prompt(req, res) {
    try {
      const { lead_id } = req.body;
      const globalServices = new GlobalServices(lead_id);
      const response = await globalServices.prompt();
      return res.status(response.code).send(response);

    } catch (error) {
      styled.error(`[GlobalController.prompt] Erro ao enviar prompt: ${error.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar prompt', error: error?.message });
    }
  }

  static async assistente(req, res) {
    try {
      const { lead_id } = req.body;
      const { assistant_id } = req.params;
      const globalServices = new GlobalServices(lead_id);
      const response = await globalServices.assistente(assistant_id);
      return res.status(response.code).send(response);

    } catch (error) {
      styled.error(`[GlobalController.assistente] Erro ao enviar mensagem para a assistente: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para a assistente', error: error?.message });
    }
  }
}