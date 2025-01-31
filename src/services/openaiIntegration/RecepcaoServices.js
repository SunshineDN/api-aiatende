import OpenaiIntegrationServices from './OpenaiIntegrationServices.js';
import LeadUtils from '../../utils/LeadUtils.js';
import styled from '../../utils/log/styledLog.js';
import LeadMessagesRepository from '../../repositories/LeadMessagesRepository.js';

export default class RecepcaoServices {
  constructor(lead_id) {
    this.lead_id = lead_id;
    this.openaiintegrationservices = new OpenaiIntegrationServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.leadMessagesRepository = new LeadMessagesRepository();
  }

  //Prompt
  async intencao() {
    try {
      styled.function('[RecepcaoServices.intencao] Recepção | Intenção...');
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

      const text = `Considere que você esteja analisando a intenção de uma frase digitada por um usuário em um chatbot. Dia de Semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3). Analise a mensagem da clínica (se houver): '${answer}' e veja em quais das situações abaixo se encaixa a intenção da mensagem do usuário: '${lead_messages}'.

#Saudacao: Para usuário realizando a Saudação (ex: Oi, Olá, Bom dia, Boa noite, Tudo bem? etc).

#ClienteAntigo: Para usuário que já é cliente antigo e queira conversar sobre algum assunto, ou para o usuário que já que já tinha algum tipo de histórico de conversa anteriormente.

#Informacao: Para usuário buscando mais informações ou valores.

#Agendamento: Para usuário com intenção clara de marcar uma consulta inicial.

#Profissional: Para usuário interessados em emprego ou em vender produtos ou serviços.

#Geral: Para os demais assuntos.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra" Exemplo: #Agendamento'`;

      const response = await this.openaiintegrationservices.prompt(this.lead_id, text);
      return { code: 200, message: 'Prompt enviado com sucesso', ...response };

    } catch (error) {
      styled.error(`[RecepcaoServices.intencao] Erro ao enviar mensagem para o prompt`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[RecepcaoServices.intencao] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async indefinido(assistant_id) {
    try {
      styled.function('[RecepcaoServices.indefinido] Recepção | Indefinido...');

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

Recebendo um usuário novo. Inicie a conversa perguntando o seu nome, caso já tenha o seu nome utilize, pois demonstra maior proximidade, e na sequência entenda os seus interesses e as suas dúvidas.'  

User message: '${lead_messages}'`;

      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[RecepcaoServices.indefinido] Erro ao enviar mensagem para o assistente`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[RecepcaoServices.indefinido] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async nao_qualificado(assistant_id) {
    try {
      styled.function('[RecepcaoServices.nao_qualificado] Recepção | Não Qualificado...');

      const { recent_messages, last_messages } = await this.leadMessagesRepository.getLastAndRecentMessages(this.lead_id, 1);
      const lead_messages = recent_messages || last_messages;

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `System message: "Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3).

Resposta do usuário: ${lead_messages}

Avaliar a opção adequada para a resposta do usuário:

1) Se a intenção do usuário for vender ou oferecer produto ou serviços, conduza com uma resposta semelhante à do exemplo:
'Muito obrigado pelo seu interesse! 
Segue nosso e-mail: *contato@dentalsante.com.br*
Estamos direcionando o seu atendimento ao nosso setor administrativo e financeiro.
Em breve, te responderão!'

2) Se a intenção do usuário de se candidatar alguma vaga disponível, conduza com uma resposta semelhante à do exemplo:
'Muito obrigado pelo seu interesse! Segue nosso e-mail: *selecao@dentalsante.com.br*
Estamos direcionando o seu atendimento ao setor de Gestão de Pessoas.
Em breve, te responderão!'

3) Se for algum usuário que já é cliente antigo e queira continuar o atendimento, conduza com uma resposta semelhante à do exemplo:
'Como você já é nosso cliente peço falar neste canal exclusivo você tem prioridade em nossos atendimentos.
*Telefone ou WhatsApp*
*(81) 3094-0020*'

4) Se for algum usuário que tenha entrado por engano, conduza com uma resposta semelhante à do exemplo:
'Somos a *Clínica Odontológica Dental Santé*, estamos sempre à disposição. Quando quiser estamos de portas aberta.'

5) Se for algum usuário que queira deixar algum feedback positivo ou negativo, conduza com uma resposta semelhante à do exemplo:
'Agradecemos pelo seu Feedback. Suas Sugestões, Elogios ou Reclamações são informadas diretamente à nossa Diretoria.'

6) Se não for nenhuma das opções acima, então receba como usuário novo. Inicie a conversa perguntando o seu nome para demonstrar proximidade, e na sequência entender os seus interesses e as suas dúvidas."`;


      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[RecepcaoServices.nao_qualificado] Erro ao enviar mensagem para o assistente`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[RecepcaoServices.nao_qualificado] ${error?.message}` });
      throw error;
    }
  }
}