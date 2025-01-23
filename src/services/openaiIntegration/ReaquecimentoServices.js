import LeadMessagesRepository from '../../repositories/LeadMessagesRepository.js';
import OpenaiIntegrationServices from './OpenaiIntegrationServices.js';

export default class ReaquecimentoServices {
  constructor(lead_id) {
    this.lead_id = lead_id;
    this.openaiintegrationservices = new OpenaiIntegrationServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
    this.leadMessagesRepository = new LeadMessagesRepository();
  }

  //Prompt
  async intencao() {
    try {
      styled.function('[ReaquecimentoServices.intencao] Recepção | Intenção...');
      const lead = await this.openaiintegrationservices.getLead({ id: this.lead_id });

      const lead_message = await this.leadMessagesRepository.getLastMessages(this.lead_id);
      const answer = await LeadUtils.findLeadField({ lead, fieldName: 'GPT | Answer', value: true });

      const text = `Considere que você esteja analisando a intenção da resposta de um usuário em um chatbot. Analise a mensagem da clínica: '${answer}', e veja em quais das situações abaixo se encaixa a intenção da mensagem do usuário: '${lead_message}'.

#Perdido: Para usuário que não quer mais receber mensagens, não quer mais contato ou não deseja mais informações.

#Informação: Para usuário que está interessado em receber informações ou precisando de mais informações, mas não quer agendar uma consulta.

#Agendamento: Para usuário com intenção clara de marcar uma consulta inicial.

#Geral: Para os demais assuntos.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra" Exemplo: #Agendamento'`;

      const response = await this.openaiintegrationservices.prompt(this.lead_id, text);
      return { code: 200, message: 'Prompt enviado com sucesso', ...response };

    } catch (error) {
      styled.error(`[ReaquecimentoServices.intencao] Erro ao enviar mensagem para o prompt`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[ReaquecimentoServices.intencao] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async frio(assistant_id) {
    try {
      styled.function('[ReaquecimentoServices.frio] Recepção | Frio...');

      const text = `Enviar mensagem para um chatbot numa tentativa de reativar os usuários que entraram em contato e depois da nossa resposta continuaremos sem dar continuidade na conversa há mais de 7 dias. Utilize mensagem direta, amigável e oferece opções para o lead interagir com o chatbot, facilitando a reativação do contato, utilizando alguns dos focos a seguir: Relembrar o valor, Oferecer algo novo, Criar urgência, Solicitar feedback, Mostrar disponibilidade. (nunca repetir uma mensagem) Exemplo: "Olá,

Notamos que você não respondeu às nossas últimas mensagens e queremos saber se ainda podemos ajudar a cuidar do seu sorriso! Na Clínica Dental Santé, estamos sempre prontos para oferecer o melhor atendimento odontológico para você.

Se precisar de uma consulta ou tiver alguma dúvida, estamos à disposição. Além disso, temos algumas novidades e condições especiais que podem ser do seu interesse!

Gostaria de agendar uma consulta ou saber mais sobre nossas condições?

Sim, quero agendar uma consulta.
Gostaria de saber mais sobre as condições.
Tenho uma dúvida. Aguardamos seu retorno!
Atenciosamente, Gabriele"`;

      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[ReaquecimentoServices.frio] Erro ao enviar mensagem para o prompt`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[ReaquecimentoServices.frio] ${error?.message}` });
      throw error;
    }
  }

  //Assistente
  async congelado(assistant_id) {
    try {
      styled.function('[ReaquecimentoServices.congelado] Recepção | Congelado...');

      const text = `Enviar mensagem para chatbot numa tentativa de reativar os usuários que entraram em contato e depois das nossas inúmeras respostas continuamos sem ter retorno do usuário há mais de 30 dias. Utilize mensagem direta, amigável e oferece opções para o lead interagir com o chatbot, facilitando a reativação do contato, utilizando alguns dos focos a seguir: Relembrar o valor, Oferecer algo novo, Criar urgência, Solicitar feedback, Mostrar disponibilidade. (nunca repetir uma mensagem). conforme exemplo: "Olá,

Notamos que você não respondeu às nossas últimas mensagens e queremos saber se ainda podemos ajudar a cuidar do seu sorriso! Na Clínica Dental Santé, nossas condições especiais terminam em breve. Não perca a oportunidade de aproveitar essas nossas formas exclusivas!

Gostaria de agendar uma consulta ou saber mais sobre nossas promoções?

Sim, quero agendar uma consulta.
Gostaria de saber mais sobre as promoções.
Tenho uma dúvida. Aguardamos seu retorno!
Atenciosamente, Gabriele"`;

      const response = await this.openaiintegrationservices.assistant(this.lead_id, text, assistant_id);
      return { code: 200, message: 'Mensagem do assistente enviada com sucesso', ...response };

    } catch (error) {
      styled.error(`[ReaquecimentoServices.congelado] Erro ao enviar mensagem para o prompt`);
      await this.openaiintegrationservices.sendErrorLog({ lead_id: this.lead_id, error: `[ReaquecimentoServices.congelado] ${error?.message}` });
      throw error;
    }
  }
}