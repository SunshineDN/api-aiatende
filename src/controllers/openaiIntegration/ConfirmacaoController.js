import styled from '../../utils/log/styled.js';
import ConfirmacaoServices from '../../services/openaiIntegration/ConfirmacaoServices.js';

export default class ConfirmacaoController {

  static async intencao(req, res) {
    try {
      const { lead_id } = req.body;
      const confirmacaoServices = new ConfirmacaoServices(lead_id);
      const response = await confirmacaoServices.intencao();
      return res.status(response.code).send(response);
    } catch (error) {
      styled.error(`[ConfirmacaoController.intencao] Erro ao enviar mensagem para o prompt: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para o prompt', error: error?.message });
    }
  }

  static async confirmar_presenca(req, res) {
    try {
      const { lead_id } = req.body;
      const { assistant_id } = req.params;
      const confirmacaoServices = new ConfirmacaoServices(lead_id);
      const response = await confirmacaoServices.confirmarPresenca(assistant_id);
      return res.status(response.code).send(response);
    } catch (error) {
      styled.error(`[ConfirmacaoController.confirmar_presenca] Erro ao enviar mensagem para o prompt: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para o prompt', error: error?.message });
    }
  }

  static async primeiro_contato_24h(req, res) {
    try {
      const { lead_id } = req.body;
      const confirmacaoServices = new ConfirmacaoServices(lead_id);
      const response = await confirmacaoServices.mensagemConfirmacao24hPrimeiroContato();
      return res.status(response.code).send(response);
    } catch (error) {
      styled.error(`[ConfirmacaoController.primeiro_contato_24h] Erro ao enviar mensagem para o prompt: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para o prompt', error: error?.message });
    }
  }

  static async segundo_contato_24h(req, res) {
    try {
      const { lead_id } = req.body;
      const confirmacaoServices = new ConfirmacaoServices(lead_id);
      const response = await confirmacaoServices.mensagemConfirmacao24hSegundoContato();
      return res.status(response.code).send(response);
    } catch (error) {
      styled.error(`[ConfirmacaoController.segundo_contato_24h] Erro ao enviar mensagem para o prompt: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para o prompt', error: error?.message });
    }
  }

  static async terceiro_contato_24h(req, res) {
    try {
      const { lead_id } = req.body;
      const confirmacaoServices = new ConfirmacaoServices(lead_id);
      const response = await confirmacaoServices.mensagemConfirmacao24hTerceiroContato();
      return res.status(response.code).send(response);
    } catch (error) {
      styled.error(`[ConfirmacaoController.terceiro_contato_24h] Erro ao enviar mensagem para o prompt: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para o prompt', error: error?.message });
    }
  }

  static async primeiro_contato_3h(req, res) {
    try {
      const { lead_id } = req.body;
      const confirmacaoServices = new ConfirmacaoServices(lead_id);
      const response = await confirmacaoServices.mensagemConfirmacao3hPrimeiroContato();
      return res.status(response.code).send(response);
    } catch (error) {
      styled.error(`[ConfirmacaoController.primeiro_contato_3h] Erro ao enviar mensagem para o prompt: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para o prompt', error: error?.message });
    }
  }

  static async segundo_contato_3h(req, res) {
    try {
      const { lead_id } = req.body;
      const confirmacaoServices = new ConfirmacaoServices(lead_id);
      const response = await confirmacaoServices.mensagemConfirmacao3hSegundoContato();
      return res.status(response.code).send(response);
    } catch (error) {
      styled.error(`[ConfirmacaoController.segundo_contato_3h] Erro ao enviar mensagem para o prompt: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar mensagem para o prompt', error: error?.message });
    }
  }
}