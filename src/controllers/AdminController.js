import AdminServices from "../services/admin/AdminServices.js";
import styled from "../utils/log/styled.js";

export default class AdminController {
  static async getLeadMessages(req, res) {
    try {
      const q_query = req?.query?.q;

      const adminServices = new AdminServices(req.params.lead_id);
      const response = await adminServices.executeGetLeadMessages(Number(q_query));
      return res.status(200).json(response);
    } catch (error) {
      styled.error(`[AdminController.getLeadMessages] Erro ao buscar mensagens do lead: ${error?.message}`);
      res.status(500).json({ error: error?.message });
    }
  }

  static async deleteLeadMessages(req, res) {
    try {
      const adminServices = new AdminServices(req.params.lead_id);
      const response = await adminServices.executeDeleteLeadMessages();
      return res.status(200).json(response);
    } catch (error) {
      styled.error(`[AdminController.deleteLeadMessages] Erro ao deletar mensagens do lead: ${error?.message}`);
      res.status(500).json({ error: error?.message });
    }
  }

  static async getLeadThreads(req, res) {
    try {
      const adminServices = new AdminServices(req.params.lead_id);
      const response = await adminServices.executeGetLeadThreads();
      return res.status(200).json(response);
    } catch (error) {
      styled.error(`[AdminController.getLeadThreads] Erro ao buscar threads do lead: ${error?.message}`);
      res.status(500).json({ error: error?.message });
    }
  }

  static async deleteLeadThreads(req, res) {
    try {
      const adminServices = new AdminServices(req.params.lead_id);
      const response = await adminServices.executeDeleteLeadThreads();
      return res.status(200).json(response);
    } catch (error) {
      styled.error(`[AdminController.deleteLeadThreads] Erro ao deletar threads do lead: ${error?.message}`);
      res.status(500).json({ error: error?.message });
    }
  }

  static async getLeadBkFunnels(req, res) {
    try {
      const adminServices = new AdminServices(req.params.lead_id);
      const response = await adminServices.executeGetLeadBkFunnels();
      return res.status(200).json(response);
    } catch (error) {
      styled.error(`[AdminController.getLeadBkFunnels] Erro ao buscar funis do lead: ${error?.message}`);
      res.status(500).json({ error: error?.message });
    }
  }

  static async deleteLeadBkFunnels(req, res) {
    try {
      const adminServices = new AdminServices(req.params.lead_id);
      const response = await adminServices.executeDeleteLeadBkFunnels();
      return res.status(200).json(response);
    } catch (error) {
      styled.error(`[AdminController.deleteLeadBkFunnels] Erro ao deletar funis do lead: ${error?.message}`);
      res.status(500).json({ error: error?.message });
    }
  }
}