import KommoOpenaiServices from '../kommo/KommoOpenaiServices.js';
import LeadUtils from '../../utils/LeadUtils.js';
import styled from '../../utils/log/styledLog.js';
import OpenaiIntegrationUtils from '../../utils/OpenaiIntegrationUtils.js';

export default class RecepcaoServices {
  constructor(lead_id) {
    this.lead_id = lead_id;
    this.kommo = new KommoOpenaiServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.openaiIntegrationUtils = new OpenaiIntegrationUtils();
  }

  //Prompt
  async intencao() {
    try {
      styled.function('[RecepcaoServices.intencao] Recepção | Intenção...');
      const lead = await this.kommo.getLead({ id: this.lead_id });

      const message_received = await LeadUtils.findLeadField({ lead, fieldName: 'GPT | Message Received', value: true });
      const answer = await LeadUtils.findLeadField({ lead, fieldName: 'GPT | Answer', value: true });

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `Considere que você esteja analisando a intenção de uma frase digitada por um usuário em um chatbot. Dia de Semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3). Analise a mensagem da clínica (se houver): '${answer}' e veja em quais das situações abaixo se encaixa a intenção da mensagem do usuário: '${message_received}'.

#Saudacao: Para usuário realizando a Saudação (ex: Oi, Olá, Bom dia, Boa noite, Tudo bem? etc).

#ClienteAntigo: Para usuário que já é cliente antigo e queira conversar sobre algum assunto.

#Informacao: Para usuário buscando mais informações ou valores.

#Agendamento: Para usuário com intenção clara de marcar uma consulta inicial.

#Profissional: Para usuário interessados em emprego ou em vender produtos ou serviços.

#Geral: Para os demais assuntos.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra" Exemplo: #Agendamento'`;

      const response = await this.openaiIntegrationUtils.prompt(this.lead_id, text);
      return { code: 200, message: 'Prompt enviado com sucesso', response };
    } catch (error) {
      styled.error(`[RecepcaoServices.intencao] Erro ao enviar mensagem para o assistente`);
      await this.kommo.sendErrorLog({ lead_id, error: `[RecepcaoServices.intencao] ${error?.message}` });
      throw new Error(error)
    }
  }

  //Assistente
  async indefinido(assistant_url) {

  }

}