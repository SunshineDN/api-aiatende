import LeadThreadsServices from "../services/leadthreads/LeadThreadsServices.js";
import styled from "../utils/log/styled.js";

export default class LeadThreadsController {

  static index(_, res) {
    return res.status(200).json({ message: "Hello, World!" });
  }

  static async deleteThread(req, res) {
    try {
      const { lead_id, confirm } = req.body;

      if (!confirm || confirm === false) {
        return res.status(400).json({ message: "Você precisa confirmar a exclusão. Por favor, envie 'confirm: true'." });
      }

      const leadThreadsServices = new LeadThreadsServices(lead_id);
      const response = await leadThreadsServices.clearThreads();
      return res.status(200).json(response);
    } catch (error) {
      styled.error("[LeadThreadsController.deleteThread] Error");
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
}