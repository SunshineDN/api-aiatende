import OpenaiIntegrationServices from './OpenaiIntegrationServices.js';
import LeadUtils from '../../utils/LeadUtils.js';
import styled from '../../utils/log/styled.js';
import LeadMessagesRepository from '../../repositories/LeadMessagesRepository.js';

export default class ConfirmacaoServices {
  constructor(lead_id) {
    this.lead_id = lead_id;
    this.openaiintegrationservices = new OpenaiIntegrationServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.leadMessagesRepository = new LeadMessagesRepository();
  }

  //Prompt
  async intencao() {
    try {
      styled.function('[ConfirmacaoServices.intencao] Confirmação | Intenção...');
      const lead = await this.openaiintegrationservices.getLead({ id: this.lead_id });

      const { recent_messages, last_messages } = await this.leadMessagesRepository.getLastAndRecentMessages(this.lead_id, 1);
      const lead_messages = recent_messages || last_messages;

      const answer = await LeadUtils.findLeadField({ lead, fieldName: 'GPT | Answer', value: true });

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = ``;

      const response = await this.openaiintegrationservices.prompt(this.lead_id, text);
      return { code: 200, message: 'Prompt enviado com sucesso', ...response };

    } catch (error) {
      styled.error(`[ConfirmacaoServices.intencao] Erro ao enviar mensagem para o prompt`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[ConfirmacaoServices.intencao] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async qualificado(assistant_id) {
    try {
      styled.function('[ConfirmacaoServices.qualificado] Confirmação | Confirmação...');

      const { recent_messages, last_messages } = await this.leadMessagesRepository.getLastAndRecentMessages(this.lead_id, 1);
      const lead_messages = recent_messages || last_messages;

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = ``;

      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[ConfirmacaoServices.qualificado] Erro ao enviar mensagem para o assistente`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[ConfirmacaoServices.qualificado] ${error?.message}` });
      throw error;
    }
  }
}