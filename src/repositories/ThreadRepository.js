import BaseRepository from './BaseRepository.js';
import prisma from '../prisma-client.js';

export default class ThreadRepository extends BaseRepository {
  #lead_id;

  /**
   * Repositório para a tabela de threads.
   * @param {Object} params
   * @param {number} params.lead_id - ID do lead.
   * @constructor
   */
  constructor({ lead_id }) {
    super(prisma.thread);
    this.#lead_id = lead_id;
  }

  async updateRun({ assistant_id, run_id }) {
    const thread = await this.model.update({
      where: {
        lead_id_assistant: {
          lead_id: this.#lead_id,
          assistant: assistant_id,
        }
      },
      data: {
        run_id,
        updated_at: new Date(),
      }
    });

    return thread;
  }

  async findThread({ assistant_id } = {}) {

    const thread = await this.findOne({
      where: {
        lead_id: this.#lead_id,
        assistant: assistant_id,
      }
    });

    if (!thread) {
      return null;
    }

    return thread;
  }

  async createThread({ thread_id, assistant_id }) {
    const thread = await this.create({
      lead_id: this.#lead_id,
      thread_id,
      assistant: assistant_id
    });

    return thread;
  }

  async deleteThread({ assistant_id }) {
    const thread = await this.delete({
      where: {
        lead_id_assistant: {
          lead_id: this.#lead_id,
          assistant: assistant_id,
        }
      }
    });

    return thread;
  }

  async findThreads({ assistant_id }) {
    const threads = await this.model.findFirst({
      where: {
        lead_id: this.#lead_id,
        assistant: assistant_id,
      }
    });

    return threads;
  }

  async updateVoid({ assistant_id }) {
    const thread = await this.model.update({
      where: {
        lead_id_assistant: {
          lead_id: this.#lead_id,
          assistant: assistant_id,
        }
      },
      data: {
        updated_at: new Date(),
      }
    });

    return thread;
  }

  async storeMessage({ assistant_id, userMessage, assistantMessage }) {
    const thread = await this.model.findUnique({
      where: {
        lead_id_assistant: {
          lead_id: this.#lead_id,
          assistant: assistant_id,
        }
      },
      select: {
        messages: true,
      }
    });

    const messages = thread?.messages || [];

    messages.push({
      role: 'user',
      content: userMessage,
      created_at: new Date(),
    });
    messages.push({
      role: 'assistant',
      content: assistantMessage,
      created_at: new Date(),
    });

    const updatedThread = await this.model.update({
      where: {
        lead_id_assistant: {
          lead_id: this.#lead_id,
          assistant: assistant_id,
        }
      },
      data: {
        messages,
        updated_at: new Date(),
      }
    });
    return updatedThread;
  }
}