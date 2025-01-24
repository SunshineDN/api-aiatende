import styled from '../../utils/log/styledLog.js';
import AgendamentoServices from '../../services/openaiIntegration/AgendamentoServices.js';

export default class AgendamentoController {

  static async form(req, res) {
    try {
      const { lead_id } = req.body;
      const { assistant_id } = req.params;
      const agendamentoServices = new AgendamentoServices(lead_id);
      const response = await agendamentoServices.form(assistant_id);
      return res.status(response.code).send(response);

    } catch (error) {
      styled.error(`[AgendamentoController.form] Erro ao enviar mensagem para a assistente: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para a assistente', error: error?.message });
    }
  }

  static async calendar(req, res) {
    try {
      const { lead_id } = req.body;
      const { assistant_id } = req.params;
      const agendamentoServices = new AgendamentoServices(lead_id);
      const response = await agendamentoServices.calendar(assistant_id);
      return res.status(response.code).send(response);
      
    } catch (error) {
      styled.error(`[AgendamentoController.calendar] Erro ao enviar mensagem para a assistente: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para a assistente', error: error?.message });
    }
  }
}