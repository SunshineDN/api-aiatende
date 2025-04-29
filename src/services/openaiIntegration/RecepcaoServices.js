import OpenaiIntegrationServices from './OpenaiIntegrationServices.js';
import LeadUtils from '../../utils/LeadUtils.js';
import styled from '../../utils/log/styled.js';
import LeadMessagesRepository from '../../repositories/LeadMessagesRepository.js';
import KommoUtils from '../../utils/KommoUtils.js';

export default class RecepcaoServices {
  constructor(lead_id) {
    this.lead_id = lead_id;
    this.integrationServices = new OpenaiIntegrationServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.repo = new LeadMessagesRepository();
  }

  //Prompt
  async intencao() {
    try {
      styled.function('[RecepcaoServices.intencao] Recepção | Intenção...');
      const lead = await this.integrationServices.getLead({ id: this.lead_id });

      const recent_messages = await this.repo.getRecentMessages(this.lead_id);
      const last_messages = await this.repo.getLastMessages(this.lead_id, 1);
      const lead_messages = recent_messages || last_messages;

      const answer = await LeadUtils.findLeadField({ lead, fieldName: 'GPT | Answer', value: true });

      const text = `Você está analisando a intenção da mensagem enviada por um usuário em um chatbot de uma clínica odontológica. Considere as informações fornecidas e identifique qual das categorias abaixo melhor representa a intenção do usuário.

Dados disponíveis:

Mensagem da clínica (resposta anterior, se houver): '${answer}'

Mensagem do usuário: '${lead_messages}'

Escolha apenas uma das opções abaixo, retornando somente o ID correspondente, como por exemplo: #Agendamento.

Categorias possíveis:

#Saudacao: Quando o usuário apenas cumprimenta (ex: Oi, Olá, Bom dia, Boa noite, Tudo bem? etc).

#ClienteAntigo: Quando o usuário já é paciente da clínica ou retoma uma conversa anterior.

#Informacao: Quando o usuário busca informações, dúvidas ou valores de tratamentos.

#Agendamento: Quando o usuário demonstra intenção clara de agendar uma consulta ou marcar horário.

#Profissional: Quando o usuário quer oferecer produtos, serviços ou procura vaga de trabalho.

#Geral: Para qualquer outro tipo de mensagem que não se encaixe nas categorias acima.

Importante: Não inclua nenhum texto adicional na resposta. Apenas o ID, como #Geral.`;

      const response = await this.integrationServices.prompt({ lead_id: this.lead_id, text });
      return { code: 200, message: 'Prompt enviado com sucesso', ...response };

    } catch (error) {
      styled.error(`[RecepcaoServices.intencao] Erro ao enviar mensagem para o prompt`);
      await this.integrationServices.sendErrorLog({ lead_id: this.lead_id, error: `[RecepcaoServices.intencao] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async identificar_fonte_entrada(assistant_id) {
    try {
      styled.function('[RecepcaoServices.identificar_fonte_entrada] Recepção | Identificar Fonte de Entrada...');

      const lead_origin = await this.repo.getFirstMessageOrigin(this.lead_id);
      return lead_origin;

    } catch (error) {
      styled.error(`[RecepcaoServices.identificar_fonte_entrada] Erro ao enviar mensagem para o assistente`);
      await this.integrationServices.sendErrorLog({ lead_id: this.lead_id, error: `[RecepcaoServices.identificar_fonte_entrada] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async indefinido(assistant_id) {
    try {
      styled.function('[RecepcaoServices.indefinido] Recepção | Indefinido...');

      const recent_messages = await this.repo.getRecentMessages(this.lead_id);
      const last_messages = await this.repo.getLastMessages(this.lead_id, 1);
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

      const response = await this.integrationServices.assistant({ lead_id: this.lead_id, text, assistant_id });
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[RecepcaoServices.indefinido] Erro ao enviar mensagem para o assistente`);
      await this.integrationServices.sendErrorLog({ lead_id: this.lead_id, error: `[RecepcaoServices.indefinido] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async nao_qualificado(assistant_id) {
    try {
      styled.function('[RecepcaoServices.nao_qualificado] Recepção | Não Qualificado...');

      const recent_messages = await this.repo.getRecentMessages(this.lead_id);
      const last_messages = await this.repo.getLastMessages(this.lead_id, 1);
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
Segue nosso e-mail: *caa.advs@gmail.com*
Estamos direcionando o seu atendimento ao nosso setor administrativo e financeiro.
Em breve, te responderão!'

2) Se a intenção do usuário de se candidatar alguma vaga disponível, conduza com uma resposta semelhante à do exemplo:
'Muito obrigado pelo seu interesse! Segue nosso e-mail: *caa.advs@gmail.com*
Estamos direcionando o seu atendimento ao setor de Gestão de Pessoas.
Em breve, te responderão!'

3) Se for algum usuário que já é cliente antigo e queira continuar o atendimento, conduza com uma resposta semelhante à do exemplo:
'Como você já é nosso cliente peço falar neste canal exclusivo você tem prioridade em nossos atendimentos.
*Telefone ou WhatsApp*
*(81) 9675-0072*'

4) Se for algum usuário que tenha entrado por engano, conduza com uma resposta semelhante à do exemplo:
'Somos a *CAA*, estamos sempre à disposição. Quando quiser estamos de portas aberta.'

5) Se for algum usuário que queira deixar algum feedback positivo ou negativo, conduza com uma resposta semelhante à do exemplo:\
'Agradecemos pelo seu Feedback. Suas Sugestões, Elogios ou Reclamações são informadas diretamente à nossa Diretoria.'

6) Se não for nenhuma das opções acima, então receba como usuário novo. Inicie a conversa perguntando o seu nome para demonstrar proximidade, e na sequência entender os seus interesses e as suas dúvidas."`;


      const response = await this.integrationServices.assistant({ lead_id: this.lead_id, text, assistant_id });
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[RecepcaoServices.nao_qualificado] Erro ao enviar mensagem para o assistente`);
      await this.integrationServices.sendErrorLog({ lead_id: this.lead_id, error: `[RecepcaoServices.nao_qualificado] ${error?.message}` });
      throw error;
    }
  }


  async #getContext() {
    const recent_messages = await this.repo.getRecentMessages(this.lead_id);
    const last_messages = await this.repo.getLastMessages(this.lead_id, 1);
    const lead_messages = recent_messages || last_messages;

    return { lead_messages };

  }

  /**
   * Recebe uma intenção como parâmetro e altera o status do lead de acordo com a intenção.
   * @param {string} intent - A intenção a ser processada.
   * @returns {Promise<void>} - Retorna uma Promise que resolve quando o status do lead for alterado.
   */
  async #changeLeadStatus(intent) {
    styled.function('[RecepcaoServices.#changeLeadStatus] Recepção | Alterando status do lead...');

    const kommoUtils = new KommoUtils({ pipelines: await this.integrationServices.getPipelines() });
    let status;
    switch (intent) {
      case '#Saudacao':
        status = kommoUtils.findStatusByName('INDEFINIDO');
        await this.integrationServices.updateLead({ id: this.lead_id, status_id: status.id, pipeline_id: status.pipeline_id });
        break;
      case '#Informacao':
        status = kommoUtils.findStatusByName('LEAD QUENTE (24H)');
        await this.integrationServices.updateLead({ id: this.lead_id, status_id: status.id, pipeline_id: status.pipeline_id });
        break;
      case '#Agendamento':
        status = kommoUtils.findStatusByName('FORM');
        await this.integrationServices.updateLead({ id: this.lead_id, status_id: status.id, pipeline_id: status.pipeline_id });
        break;
      case '#Profissional':
        status = kommoUtils.findStatusByName('ADMINISTRATIVO');
        await this.integrationServices.updateLead({ id: this.lead_id, status_id: status.id, pipeline_id: status.pipeline_id });
        break;
      default:
        status = kommoUtils.findStatusByName('INDEFINIDO');
        await this.integrationServices.updateLead({ id: this.lead_id, status_id: status.id, pipeline_id: status.pipeline_id });
        break;
    }

    return;
  }

  async processar(assistant_id) {
    try {
      styled.function('[RecepcaoServices.processar] Recepção | Processando...');

      const { lead_messages } = await this.#getContext();


    } catch (error) {
      styled.error(`[RecepcaoServices.processar] Erro ao processar a mensagem`);
      await this.integrationServices.sendErrorLog({ lead_id: this.lead_id, error: `[RecepcaoServices.processar] ${error?.message}` });
      throw error;
    }
  }
}