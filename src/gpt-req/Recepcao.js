require('dotenv').config();
const GetAccessToken = require('../services/kommo/GetAccessToken');
const GetAnswer = require('../services/kommo/GetAnswer');
const GetMessageReceived = require('../services/kommo/GetMessageReceived');
const styled = require('../utils/styledLog');
const Communicator = require('../utils/Communicator');

class Recepcao {
  static async intencao(req, res) {
    styled.function('Prompt | BOT - Recepção | Intenção...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);

      const message_received = await GetMessageReceived(req.body, access_token);
      const answer = await GetAnswer(req.body, access_token);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `Considere que você esteja analisando a intenção de uma frase digitada por um usuário em um chatbot. Dia de Semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3). Analise a mensagem da clínica (se houver): '${answer}' e veja em quais das situações abaixo se encaixa a intenção da mensagem do usuário: '${message_received}'.

#Saudacao: Para usuário realizando a Saudação (ex: Oi, Olá, Bom dia, Boa noite, Tudo bem? etc).

#Informacao: Para usuário buscando informações, informando sintomas, pedindo tratamento odontológicos, informações de dentistas, consultórios, clínicas ou valores dos serviços.

#Agendamento: Para usuário com intenção clara de marcar uma consulta inicial.

#Profissional: Para usuário interessados em emprego ou apresentação de produtos ou serviços.

#Geral: Para os demais assuntos.

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra" Exemplo: #Agendamento'`;
      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  static async indefinido(req, res) {
    styled.function('Assistant | BOT - Recepção | Indefinido...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const message_received = await GetMessageReceived(req.body, access_token);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      const text = `System message: 'Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3).

Recebendo um usuário novo. Inicie a conversa perguntando o seu nome, caso já tenha o seu nome utilize, pois demonstra maior proximidade, e na sequência entenda os seus interesses e as suas dúvidas odontológicas. Apresentar que a clínica Dental Santé é o local certo para resolver suas questões de saúde e estética odontológica.'  

User message: '${message_received}'`;

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

  static async nao_qualificado(req, res) {
    styled.function('Assistant | BOT - Recepção | Não Qualificado...');
    try {
      const access_token = process.env.ACCESS_TOKEN || await GetAccessToken(req.body);
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

      const text = `System message: "Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife (GMT-3).

Resposta do usuário: '${message_received}.'

Avaliar a intenção do usuário:

1) Se a intenção do usuário for vender ou oferecer produto ou serviços odontológico, médicos ou de marketing, então conduza com a seguinte resposta, exemplo:
'Muito obrigado pelo seu interesse! 
Segue nosso e-mail: *contato@dentalsante.com.br* 
Estamos direcionando o seu atendimento ao nosso setor administrativo e financeiro. 
Em breve, te responderão!'  

2) Se a intenção do usuário de se candidatar alguma vaga disponível na clínica , então conduza com a seguinte resposta, exemplo:
'Muito obrigado pelo seu interesse! 
Segue nosso e-mail: *selecao@dentalsante.com.br*
Estamos direcionando o seu atendimento ao setor de Gestão de Pessoas.

Em breve, te responderão!'

3) Se for algum usuário que já é cliente antigo da Dental Santé e queira continuar o atendimento, então conduza com a seguinte resposta, exemplo:
'Como você já é nosso cliente peço falar neste canal exclusivo* 😘 Você tem prioridade em nossos atendimentos.
*Telefone ou WhatsApp*
*(81) 3094-0020*'

4) Se for algum usuário que tenha entrado por engano com nada relacionado a odontologia, então conduza com a seguinte resposta, exemplo:
'Somos a Clínica Odontológica *Dental Santé*, estamos sempre à disposição para Realizar o seu tratamento *saúde e estética Bucal*. Quando quiser estamos de portas aberta. '

5) Se for algum usuário que queira deixar algum feedback positivo ou negativo sobre a clínica Dental Santé, então conduza com a seguinte resposta, exemplo: '
Agradecemos pelo seu Feedback. 
Suas Sugestões, Elogios ou Reclamações são informadas diretamente à nossa Diretoria. '

6) Senão for nada do acima, então:  
'Receba como usuário novo. 
Inicie a conversa perguntando o seu nome para demonstrar proximidade, e na sequência entender os seus interesses e as suas dúvidas odontológicas. Mostrar que a clínica Dental Santé é o local certo para resolver suas questões de saúde odontológicas.'"`;

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

module.exports = Recepcao;
