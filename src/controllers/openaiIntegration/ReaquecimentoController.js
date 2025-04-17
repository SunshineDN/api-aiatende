import styled from '../../utils/log/styled.js';
import ReaquecimentoServices from '../../services/openaiIntegration/ReaquecimentoServices.js';

export default class ReaquecimentoController {

  static async intencao(req, res) {
    try {
      const { lead_id } = req.body;
      const reaquecimentoServices = new ReaquecimentoServices(lead_id);
      const response = await reaquecimentoServices.intencao();
      return res.status(response.code).send(response);

    } catch (error) {
      styled.error(`[ReaquecimentoController.intencao] Erro ao enviar prompt: ${error.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar prompt', error: error?.message });
    }
  }

  static async frio(req, res) {
    try {
      const { lead_id } = req.body;
      const { assistant_id } = req.params;
      const reaquecimentoServices = new ReaquecimentoServices(lead_id);
      const response = await reaquecimentoServices.frio(assistant_id);
      return res.status(response.code).send(response);

    } catch (error) {
      styled.error(`[ReaquecimentoController.frio] Erro ao enviar mensagem para a assistente: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para a assistente', error: error?.message });
    }
  }

  static async congelado(req, res) {
    try {
      const { lead_id } = req.body;
      const { assistant_id } = req.params;
      const reaquecimentoServices = new ReaquecimentoServices(lead_id);
      const response = await reaquecimentoServices.congelado(assistant_id);
      return res.status(response.code).send(response);
      
    } catch (error) {
      styled.error(`[ReaquecimentoController.congelado] Erro ao enviar mensagem para a assistente: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para a assistente', error: error?.message });
    }
  }
}