import styled from '../../utils/log/styledLog.js';
import RecepcaoServices from '../../services/openaiIntegration/RecepcaoServices.js';

export default class Recepcao {

  //Prompt
  static async intencao(req, res) {
    try {
      const { lead_id } = req.body;
      const recepcaoServices = new RecepcaoServices(lead_id);
      const response = await recepcaoServices.intencao();
      return res.status(response.code).send(response);

    } catch (error) {
      styled.error(`[Recepcao.intencao] Erro ao enviar prompt: ${error.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar prompt', error: error?.message });
    }
  }

  //Assistente
  static async indefinido(req, res) {
    try {
      const { lead_id } = req.body;
      const { assistant_id } = req.params;
      const recepcaoServices = new RecepcaoServices(lead_id);
      const response = await recepcaoServices.indefinido(assistant_id);
      return res.status(response.code).send(response);

    } catch (error) {
      styled.error(`[Recepcao.indefinido] Erro ao enviar mensagem para a assistente: ${error?.message}`);
      console.error(error);
      return res.status(500).send({ message: 'Erro ao enviar prompt', error: error?.message });
    }
  }

  //Assistente
  static async nao_qualificado(req, res) {
    styled.function('Assistant | BOT - Recepção | Não Qualificado...');
    try {
      const access_token = GetAccessToken();
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `System message:
"Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3).

Resposta do usuário: ${message_received}

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
'Somos a *CAA*, estamos sempre à disposição. Quando quiser estamos de portas aberta.'

5) Se for algum usuário que queira deixar algum feedback positivo ou negativo, conduza com uma resposta semelhante à do exemplo:\
'Agradecemos pelo seu Feedback. Suas Sugestões, Elogios ou Reclamações são informadas diretamente à nossa Diretoria.'

6) Se não for nenhuma das opções acima, então receba como usuário novo. Inicie a conversa perguntando o seu nome para demonstrar proximidade, e na sequência entender os seus interesses e as suas dúvidas."`;

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para a assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para a assistente');
    }
  }
}