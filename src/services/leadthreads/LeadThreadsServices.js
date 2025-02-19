import OpenAI from "openai";
import LeadThreadRepository from "../../repositories/LeadThreadRepository.js";
import styled from "../../utils/log/styled.js";

/**
 * Class responsible
 * for managing the
 * creation and deletion
 * of threads in the
 * OpenAI API.
 */
export default class LeadThreadsServices {
  #openai = new OpenAI(process.env.OPENAI_API_KEY);
  #leadThreadRepository = new LeadThreadRepository();
  #lead_id;

  /**
   * @param {number} lead_id
   * The lead ID.
   */
  constructor(lead_id = null) {
    this.#lead_id = lead_id;
  }

  /**
   * Create a new thread
   * in the OpenAI API.
   * 
   * @param {number} assistant_id - The assistant ID.
   * @param {string} message - The message to send
   * 
   * @returns {Promise<object>}
   * The response from the
   * OpenAI API.
   */
  async creatreThread(assistant_id, message = '') {
    const existThreads = await this.#leadThreadRepository.findThreads(this.#lead_id);

    let newThread;
    if(message) {
      newThread = await this.#openai.beta.threads.create({
        messages: [
          {
            role: "system",
            content: message
          }
        ]
      });
    } else {
      newThread = await this.#openai.beta.threads.create({
        messages: [
          {
            role: "system",
            content: "Olá, tudo bem?"
          }
        ]
      });
    }
    styled.success('[LeadThreadsServices.createThread] - Thread criado com sucesso no OpenAI');

    if (!existThreads) {
      styled.info('[LeadThreadsServices.createThread] - Thread não encontrado, criando novo...');
      await this.#leadThreadRepository.create({
        leadID: this.#lead_id,
        threadID: [newThread.id],
        assistant_id
      })
    } else {
      styled.info('[LeadThreadsServices.createThread] - Thread encontrado, atualizando informações...');
      await this.#leadThreadRepository.updateThreads(this.#lead_id, {
        threadID: [...(existThreads.threadID || []), newThread.id],
        assistant_id: [...(existThreads.assistant_id || []), assistant_id]
      })
    }

    styled.success('[LeadThreadsServices.createThread] - Thread adicionado ao Lead');
  }

  async clearThreads() {
    const exists = await this.#leadThreadRepository.findThreads(this.#lead_id);

    if (exists) {
      const promises = exists.threadID.map((threadID) => this.#openai.beta.threads.del(threadID));
      await Promise.all(promises);
      await this.#leadThreadRepository.deleteThreads(this.#lead_id);
      return { message: "Thread(s) deletado(s)." };
    } else {
      return { message: "Thread(s) não encontrado(s)." };
    }
  }
}