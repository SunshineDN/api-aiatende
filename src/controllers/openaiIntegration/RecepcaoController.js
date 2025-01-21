import styled from '../../utils/log/styledLog.js';
import RecepcaoServices from '../../services/openaiIntegration/RecepcaoServices.js';

export default class Recepcao {

  //Prompt
  static async intencao(req, res) {
    try {
      const { lead_id } = req.body;
      const recepcaoServices = new RecepcaoServices(lead_id);
      const response = await recepcaoServices.intencao();
      return res.status(response.code).send(response);

    } catch (error) {
      styled.error(`[Recepcao.intencao] Erro ao enviar prompt: ${error.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar prompt', error: error?.message });
    }
  }

  //Assistente
  static async indefinido(req, res) {
    try {
      const { lead_id } = req.body;
      const { assistant_id } = req.params;
      const recepcaoServices = new RecepcaoServices(lead_id);
      const response = await recepcaoServices.indefinido(assistant_id);
      return res.status(response.code).send(response);

    } catch (error) {
      styled.error(`[Recepcao.indefinido] Erro ao enviar mensagem para a assistente: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar prompt', error: error?.message });
    }
  }

  //Assistente
  static async nao_qualificado(req, res) {
    styled.function('Assistant | BOT - Recepção | Não Qualificado...');
    try {
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const recepcaoServices = new RecepcaoServices(leadID);
      const response = await recepcaoServices.nao_qualificado(assistant_id);
      return res.status(response.code).send(response);
      
    } catch (error) {
      styled.error(`[Recepcao.nao_qualificado] Erro ao enviar mensagem para a assistente: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar prompt', error: error?.message });
    }
  }
}