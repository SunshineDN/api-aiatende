import CutucadaServices from "../../services/openaiIntegration/CutucadaServices.js";
import styled from "../../utils/log/styled.js";

export default class CutucadaController {

  static async intencao(req, res) {
    try {
      const { lead_id } = req.body;
      const cutucadaServices = new CutucadaServices(lead_id);
      const response = await cutucadaServices.intencao();
      return res.status(response.code).send(response);
    } catch (error) {
      styled.error(`[CutucadaController.intencao] Erro ao enviar mensagem para o prompt: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para o prompt', error: error?.message });
    }
  }

  static async gerar_perguntas(req, res) {
    try {
      const { lead_id } = req.body;
      const cutucadaServices = new CutucadaServices(lead_id);
      const response = await cutucadaServices.gerar_perguntas();
      return res.status(response.code).send(response);
    } catch (error) {
      styled.error(`[CutucadaController.gerar_perguntas] Erro ao enviar mensagem para o prompt: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para o prompt', error: error?.message });
    }
  }

  static async assistente(req, res) {
    try {
      const { lead_id, assistant_id } = req.body;
      const cutucadaServices = new CutucadaServices(lead_id);
      const response = await cutucadaServices.assistente(assistant_id);
      return res.status(response.code).send(response);
    } catch (error) {
      styled.error(`[CutucadaController.assistente] Erro ao enviar mensagem para o assistente: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para o assistente', error: error?.message });
    }
  }

}