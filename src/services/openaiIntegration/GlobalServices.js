import OpenaiIntegrationServices from './OpenaiIntegrationServices.js';
import styled from '../../utils/log/styled.js';
import LeadMessagesRepository from '../../repositories/LeadMessagesRepository.js';

export default class GlobalServices {
  constructor(lead_id) {
    this.lead_id = lead_id;
    this.openaiintegrationservices = new OpenaiIntegrationServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.leadMessagesRepository = new LeadMessagesRepository();
  }

  //Prompt
  async prompt() {
    try {
      styled.function('[GlobalServices.prompt] Global | Prompt...');
      const { recent_messages, last_messages } = await this.leadMessagesRepository.getLastAndRecentMessages(this.lead_id, 1);
      const lead_messages = recent_messages || last_messages;
      const response = await this.openaiintegrationservices.prompt({ lead_id: this.lead_id, text: lead_messages });
      return { code: 200, message: 'Prompt enviado com sucesso', ...response };

    } catch (error) {
      styled.error(`[GlobalServices.prompt] Erro ao enviar mensagem para o prompt`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[GlobalServices.prompt] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async assistente(assistant_id) {
    try {
      styled.function('[GlobalServices.assistente] Global | Assistente...');

      const { recent_messages, last_messages } = await this.leadMessagesRepository.getLastAndRecentMessages(this.lead_id, 1);
      const lead_messages = recent_messages || last_messages;
      const response = await this.openaiintegrationservices.assistant({ lead_id: this.lead_id, text: lead_messages, assistant_id });
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[GlobalServices.assistente] Erro ao enviar mensagem para o assistente`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[GlobalServices.assistente] ${error?.message}` });
      throw error;
    }
  }
}