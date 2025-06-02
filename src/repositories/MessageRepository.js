import BaseRepository from "./BaseRepository.js";
import prisma from "../prisma-client.js";

export default class MessageRepository extends BaseRepository {
  constructor() {
    super(prisma.messages);
  }

  /**
   * Recupera o contexto do histórico de mensagens do lead em ordem crescente de data de criação
   * @param {number} lead_id
   * @returns {Promise<Array<{ lead_id: number, agent_name: string ,role: string, content: string, createdAt: Date, updatedAt: Date }>>}
   */
  async getHistory(lead_id) {
    const messages = await this.model.findMany({
      where: { lead_id },
      orderBy: [{ createdAt: "asc" }],
    });

    return messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
  }
}