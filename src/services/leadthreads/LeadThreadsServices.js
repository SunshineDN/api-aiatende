import OpenAI from "openai";
import LeadThreadRepository from "../../repositories/LeadThreadRepository.js";

export default class LeadThreadsServices {
  constructor(lead_id) {
    this.lead_id = lead_id;
    this.leadThreadRepository = new LeadThreadRepository();
    this.openai = new OpenAI(process.env.OPENAI_API_KEY);
  }

  async clearThreads() {
    const exists = await this.leadThreadRepository.findThreads(this.lead_id);

    if (exists) {
      const promises = exists.threadID.map((threadID) => this.openai.beta.threads.del(threadID));
      await Promise.all(promises);
      await this.leadThreadRepository.deleteThreads(this.lead_id);
      return { message: "Thread(s) deletado(s)." };
    } else {
      return { message: "Thread(s) não encontrado(s)." };
    }
  }
}