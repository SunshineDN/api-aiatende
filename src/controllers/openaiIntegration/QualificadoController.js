import styled from '../../utils/log/styledLog.js';
import QualificadoServices from '../../services/openaiIntegration/QualificadoServices.js';

export default class QualificadoController {

  static async intencao(req, res) {
    try {
      const { lead_id } = req.body;
      const qualificadoServices = new QualificadoServices(lead_id);
      const response = await qualificadoServices.intencao();
      return res.status(response.code).send(response);

    } catch (error) {
      styled.error(`[QualificadoController.intencao] Erro ao enviar prompt: ${error.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar prompt', error: error?.message });
    }
  }

  static async qualificado(req, res) {
    try {
      const { lead_id } = req.body;
      const { assistant_id } = req.params;
      const qualificadoServices = new QualificadoServices(lead_id);
      const response = await qualificadoServices.qualificado(assistant_id);
      return res.status(response.code).send(response);

    } catch (error) {
      styled.error(`[QualificadoController.qualificado] Erro ao enviar mensagem para a assistente: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para a assistente', error: error?.message });
    }
  }
}