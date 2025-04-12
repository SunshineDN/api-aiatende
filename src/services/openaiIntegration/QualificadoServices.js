import OpenaiIntegrationServices from './OpenaiIntegrationServices.js';
import LeadUtils from '../../utils/LeadUtils.js';
import styled from '../../utils/log/styled.js';
import LeadMessagesRepository from '../../repositories/LeadMessagesRepository.js';

export default class QualificadoServices {
  constructor(lead_id) {
    this.lead_id = lead_id;
    this.openaiintegrationservices = new OpenaiIntegrationServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.leadMessagesRepository = new LeadMessagesRepository();
  }

  //Prompt
  async intencao() {
    try {
      styled.function('[QualificadoServices.intencao] Qualificado | Intenção...');
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

      const text = `System message: 'Considere que você esteja analisando a intenção de uma frase digitada por um usuário em um chatbot. Dia de Semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3). Analise a mensagem: ${answer} e veja em quais das situações abaixo encaixa a intenção da resposta do usuário: '${lead_messages}'.

#Saudacao: Para leads Realizando a Saudação (exemplo: Oi, Olá, Bom dia, Boa noite, Tudo bem? etc).

#Informacao: Para usuário buscando informações.

#valores: Para usuário buscando valores dos serviços.

#Agendamento: Para usuário com intenção clara de marcar uma consulta inicial (exemplo: sim, agendar, marcar, consulta).

#Geral: Para os demais assuntos.

#1mes: Para usuário que ainda não pretendem agendar agora, mas tem a intenção de agendar no futuro.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra:" Exemplo: #Agendamento'`;

      const response = await this.openaiintegrationservices.prompt({ lead: this.lead_id, text });
      return { code: 200, message: 'Prompt enviado com sucesso', ...response };

    } catch (error) {
      styled.error(`[QualificadoServices.intencao] Erro ao enviar mensagem para o prompt`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[QualificadoServices.intencao] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async qualificado(assistant_id) {
    try {
      styled.function('[QualificadoServices.qualificado] Qualificado | Qualificado...');

      const { recent_messages, last_messages } = await this.leadMessagesRepository.getLastAndRecentMessages(this.lead_id, 1);
      const lead_messages = recent_messages || last_messages;

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `System message: 'Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3).

O usuário entrou no fluxo do agendamento, ou seja, o usuário quer ter mais informações.
Vamos mostrar nosso conhecimento com respostas bem precisas, mas de simples entendimento. Crie cada vez mais desejo para que ele queira agendar conosco.'

User message: '${lead_messages}'`;

      const response = await this.openaiintegrationservices.assistant({ lead_id: this.lead_id, text, assistant_id });
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[QualificadoServices.qualificado] Erro ao enviar mensagem para o assistente`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[QualificadoServices.qualificado] ${error?.message}` });
      throw error;
    }
  }
}