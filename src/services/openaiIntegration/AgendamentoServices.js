import LeadMessagesRepository from '../../repositories/LeadMessagesRepository.js';
import OpenaiIntegrationServices from './OpenaiIntegrationServices.js';
import styled from '../../utils/log/styledLog.js';
import LeadUtils from '../../utils/LeadUtils.js';

export default class AgendamentoServices {
  constructor(lead_id) {
    this.lead_id = lead_id;
    this.openaiintegrationservices = new OpenaiIntegrationServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.leadMessagesRepository = new LeadMessagesRepository();
  }

  //Assistente
  async form(assistant_id) {
    try {
      styled.function('[AgendamentoServices.form] Agendamento | BkFunnels...');

      const form = process.env.FORM || '';

      const lead_message = await this.leadMessagesRepository.getRecentMessages(this.lead_id);
      let text;

      if (form) {
        text = `Mensagens do usuário: "${lead_message}".

Instruções: "Somente enquanto aparecer esta instrução específica, ao finalizar a resposta, você deve enviar o link para cadastro de forma explícita para que o usuário possa agendar uma consulta. O link para cadastro é: ${form}. Insira somente o link direto para agendar consulta, sem adicionar nenhum texto, botão adicional ou encurtador.".`;
      } else {
        text = `Mensagens do usuário: "${lead_message}".

Instruções: "Somente enquanto aparecer esta instrução específica, ao finalizar a resposta, você deve lembrar o usuário de acessar o link para cadastro que foi enviado anteriormente para que o usuário possa agendar uma consulta."`;
      }

      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[AgendamentoServices.form] Erro ao enviar mensagem para o prompt`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[AgendamentoServices.form] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async calendar(assistant_id) {
    try {
      styled.function('[AgendamentoServices.calendar] Agendamento | Calendar...');

      const lead = await this.openaiintegrationservices.getLead({ id: this.lead_id });

      const calendario = LeadUtils.findLeadField({ lead, fieldName: 'Calendário', value: true });

      const lead_message = await this.leadMessagesRepository.getRecentMessages(this.lead_id);
      let text;

      if (calendario) {
        text = `Mensagens do usuário: "${lead_message}".

Instruções: "Somente enquanto aparecer esta instrução específica, ao finalizar a resposta, você deve enviar o link para acessar o calendário de forma explícita para que o usuário possa agendar uma consulta. O link para acessar o calendário é: ${calendario}. Insira somente o link direto para agendar consulta, sem adicionar nenhum texto, botão adicional ou encurtador.".`;
      } else {
        text = `Mensagens do usuário: "${lead_message}".

Instruções: "Somente enquanto aparecer esta instrução específica, ao finalizar a resposta, você deve lembrar o usuário de acessar o link para acessar o calendário que foi enviado anteriormente para que o usuário possa agendar uma consulta."`;
      }
      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[AgendamentoServices.calendar] Erro ao enviar mensagem para o prompt`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[AgendamentoServices.calendar] ${error?.message}` });
      throw error;
    }
  }
}