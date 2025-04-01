import OpenaiIntegrationServices from './OpenaiIntegrationServices.js';
import LeadUtils from '../../utils/LeadUtils.js';
import styled from '../../utils/log/styled.js';
import LeadMessagesRepository from '../../repositories/LeadMessagesRepository.js';
import DateUtils from '../../utils/DateUtils.js';

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

      const text = `Considere que você esteja analisando a intenção de uma frase digitada por um usuário em um chatbot.
Analise a mensagem: '${answer}' e veja em quais das situações abaixo encaixa a intenção para a resposta: '${lead_messages}'.
#Confirmação: A resposta tem intenção de confirmar ou continuar com o agendamento.

#NãoConfirmar: A resposta tem intenção de não confirmar ou não continuar com o agendamento.

#Reagendar: Caso a resposta tenha a intenção de marcar ou data agendada para outra data.

#Desmarcar: Caso a resposta tenha intenção de desmarcar.

#Geral: Não condiz com os demais cenários.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra:" Exemplo: #Atendente`;

      const response = await this.openaiintegrationservices.prompt(this.lead_id, text);
      return { code: 200, message: 'Prompt enviado com sucesso', ...response };

    } catch (error) {
      styled.error(`[ConfirmacaoServices.intencao] Erro ao enviar mensagem para o prompt`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[ConfirmacaoServices.intencao] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async confirmarPresenca(assistant_id) {
    try {
      styled.function('[ConfirmacaoServices.confirmarPresenca] Confirmação | Assistente...');

      const lead = await this.openaiintegrationservices.getLead({ id: this.lead_id });
      const scheduleDate = LeadUtils.findLeadField({ lead, fieldName: 'Data do Agendamento', value: true });
      const convertDate = DateUtils.secondsToDate(Number(scheduleDate));
      const date = DateUtils.formatDate({ date: convertDate, withWeekday: true });

      const { days, hours, minutes } = DateUtils.dateDurationCalculator(convertDate);

      const text = `System message: Envie uma mensagem para o usuário avisando sobre a data de agendamento: '${date}'. Adicione também que faltam ${days} dia(s), ${hours} hora(s) e ${minutes} minuto(s) para a consulta.`;

      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[ConfirmacaoServices.confirmarPresenca] Erro ao enviar mensagem para o assistente`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[ConfirmacaoServices.confirmarPresenca] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async mensagemConfirmacao24hPrimeiroContato(assistant_id) {
    try {
      styled.function('[ConfirmacaoServices.mensagemConfirmacao24hPrimeiroContato] Confirmação | Esteira de Confirmação 24 horas - Primeiro Contato...');

      const lead = await this.openaiintegrationservices.getLead({ id: this.lead_id });
      const scheduleDate = LeadUtils.findLeadField({ lead, fieldName: 'Data do Agendamento', value: true });
      const convertDate = DateUtils.secondsToDate(Number(scheduleDate));
      const date = DateUtils.formatDate({ date: convertDate, withWeekday: true });

      const text = `System message: 'Retorne apenas uma mensagem para o usuário para a confirmação da sua ida para a clínica no dia: ${date}. Aqui vai um exemplo de mensagem: "Lembre-se do compromisso da sua consulta odontológica com *DENTISTA* é AMANHÃ

Dia e Hora:
19/08/2024 às 14:30

Não esqueça de confirmar sua presença, respondendo esta mensagem agora!

Confirmado?"'`;

      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[ConfirmacaoServices.mensagemConfirmacao24hPrimeiroContato] Erro ao enviar mensagem para o assistente`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[ConfirmacaoServices.qualificado] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async mensagemConfirmacao24hSegundoContato(assistant_id) {
    try {
      styled.function('[ConfirmacaoServices.mensagemConfirmacao24hSegundoContato] Confirmação | Esteira de Confirmação 24 horas - Segundo Contato...');

      const text = `System message: Usuário passou 2 horas sem responder a mensagem anterior, retorne apenas uma mensagem dizendo que é muito importante que ele confirme a presença no dia marcado. Exemplo de mensagem: "Olá, Tudo bem? Ainda não recebemos a confirmação da sua presença na consulta odontológica de amanhã.
Por favor, confirmar o mais rápido possível, Obrigada!

Confirmado?"`;

      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[ConfirmacaoServices.mensagemConfirmacao24hSegundoContato] Erro ao enviar mensagem para o assistente`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[ConfirmacaoServices.qualificado] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async mensagemConfirmacao24hTerceiroContato(assistant_id) {
    try {
      styled.function('[ConfirmacaoServices.mensagemConfirmacao24hTerceiroContato] Confirmação | Esteira de Confirmação 24 horas - Terceiro Contato...');

      const scheduleDate = LeadUtils.findLeadField({ lead, fieldName: 'Data do Agendamento', value: true });
      const convertDate = DateUtils.secondsToDate(Number(scheduleDate));
      const date = DateUtils.formatDate({ date: convertDate, withWeekday: true });

      const text = `System message: Usuário passou mais 2 horas sem responder a mensagem anterior, retorne apenas uma mensagem pedindo para ele confirmar sua presença para o dia: ${date}. Exemplo de mensagem: "Gostaria de lembrar que o processo de confirmação da consulta é muito importante. Temos que planejar adequadamente seu atendimento. Por favor, confirme sua presença respondendo agora esta mensagem.

Dia e Hora:
19/08/2024 às 14:30

Confirmado?"`;

      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[ConfirmacaoServices.mensagemConfirmacao24hTerceiroContato] Erro ao enviar mensagem para o assistente`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[ConfirmacaoServices.qualificado] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async mensagemConfirmacao3hPrimeiroContato(assistant_id) {
    try {
      styled.function('[ConfirmacaoServices.mensagemConfirmacao3hPrimeiroContato] Confirmação | Esteira de Confirmação 3 horas - Primeiro Contato...');

      const text = `System message: Usuário confirmou e a consulta dele será *HOJE*. Retorne apenas uma mensagem pedindo para ele confirmar a presença. Exemplo de mensagem: "É *HOJE*!

Por favor, confirme agora sua presença.

Dia e hora:

19/08/2024 às 14:00

Ok?"`;

      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[ConfirmacaoServices.mensagemConfirmacao3hPrimeiroContato] Erro ao enviar mensagem para o assistente`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[ConfirmacaoServices.qualificado] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async mensagemConfirmacao3hSegundoContato(assistant_id) {
    try {
      styled.function('[ConfirmacaoServices.mensagemConfirmacao3hSegundoContato] Confirmação | Esteira de Confirmação 3 horas - Segundo Contato...');

      const text = `System message: Usuário passou 30 minutos sem responder a mensagem anterior, retorne apenas uma mensagem perguntando se pode confirmar a presença dele.`;

      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[ConfirmacaoServices.mensagemConfirmacao3hSegundoContato] Erro ao enviar mensagem para o assistente`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[ConfirmacaoServices.qualificado] ${error?.message}` });
      throw error;
    }
  }
}