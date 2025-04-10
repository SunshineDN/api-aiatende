import LeadMessagesRepository from "../../repositories/LeadMessagesRepository.js";
import LeadUtils from "../../utils/LeadUtils.js";
import styled from "../../utils/log/styled.js";
import OpenaiIntegrationServices from "./OpenaiIntegrationServices.js";

export default class CutucadaServices {
  constructor(lead_id) {
    this.lead_id = lead_id;
    this.openaiintegrationservices = new OpenaiIntegrationServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.leadMessagesRepository = new LeadMessagesRepository();
  }

  async intencao() {
    try {
      styled.function('[CutucadaServices.intencao] Cutucada | Intenção...');
      const lead = await this.openaiintegrationservices.getLead({ id: this.lead_id });

      const { recent_messages, last_messages } = await this.leadMessagesRepository.getLastAndRecentMessages(this.lead_id, 1);
      const lead_messages = recent_messages || last_messages;

      const answer = await LeadUtils.findLeadField({ lead, fieldName: 'GPT | Answer', value: true });

      const text = `Aja como um analista de marketing experiente em comunicação com clientes.
Receba a mensagem enviada pela clínica: ${answer}.
Agora analise a resposta recebida do usuário: ${lead_messages}.

Sua tarefa é identificar a intenção do usuário com base nas categorias abaixo e retornar somente o ID correspondente no formato: #Categoria (exemplo: #Geral).
Não adicione nenhuma explicação adicional.

Categorias disponíveis:

#Perdido: Quando o usuário demonstra desinteresse, quer encerrar a conversa, não responde à abordagem ou ignora completamente a mensagem.

#Aguardar: Quando o usuário está ocupado, diz que vai responder depois ou demonstra intenção de retomar a conversa mais tarde.

#Continuar: Quando o usuário interage diretamente com a mensagem da clínica, demonstrando interesse, fazendo perguntas ou dando continuidade à conversa.

#Geral: Quando a resposta trata de outro assunto que não se encaixa em nenhuma das categorias anteriores.`;

      const response = await this.openaiintegrationservices.prompt(this.lead_id, text);
      return { code: 200, message: 'Prompt enviado com sucesso', ...response };
    } catch (error) {
      styled.error(`[CutucadaServices.intencao] Erro ao enviar mensagem para o prompt`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[CutucadaServices.intencao] ${error?.message}` });
      throw error;
    }
  }

  async gerar_perguntas() {
    try {
      styled.function('[CutucadaServices.gerar_perguntas] Cutucada | Gerar Perguntas...');
      const lead = await this.openaiintegrationservices.getLead({ id: this.lead_id });

      const answer = await LeadUtils.findLeadField({ lead, fieldName: 'GPT | Answer', value: true });

      const text = `O usuário está inativo há algum tempo.
Sua tarefa é criar uma mensagem curta e gentil para incentivar a retomada da conversa.
Você pode se inspirar em exemplos como:
“Vamos continuar?”, “Estou te aguardando”, “Continua aí?”, “Ainda está interessado?”
Mas evite repeti-los exatamente — inove nas abordagens para que cada mensagem pareça única e personalizada.

Considere o conteúdo da última mensagem enviada para este usuário:
${answer}

Retorne apenas a pergunta que será enviada ao usuário.
Não inclua nenhuma explicação, tag ou texto adicional.`;

      const response = await this.openaiintegrationservices.prompt(this.lead_id, text);
      return { code: 200, message: 'Prompt enviado com sucesso', ...response };
    } catch (error) {
      styled.error(`[CutucadaServices.gerar_perguntas] Erro ao enviar mensagem para o prompt`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[CutucadaServices.gerar_perguntas] ${error?.message}` });
      throw error;
    }
  }

  async assistente(assistant_id) {
    try {
      styled.function('[CutucadaServices.assistente] Cutucada | Assistente...');

      const text = `System message:
Crie uma mensagem para dar continuidade à conversa com o usuário, mantendo o assunto das últimas interações, mas sem mencionar agendamento.

A mensagem deve soar natural, leve e manter o usuário engajado, como em uma conversa contínua.
Evite qualquer menção direta a marcar, remarcar ou confirmar horários.

Use o contexto das últimas mensagens trocadas para manter a coerência no diálogo.
Retorne apenas a mensagem que será enviada ao usuário.`;

      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };
    } catch (error) {
      styled.error(`[CutucadaServices.assistente] Erro ao enviar mensagem para o assistente`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[CutucadaServices.assistente] ${error?.message}` });
      throw error;
    }
  }
}