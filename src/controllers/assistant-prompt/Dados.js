import styled from '../../utils/log/styledLog.js';
import { GetAccessToken } from '../../services/kommo/GetAccessToken.js';
import { GetAnswer } from '../../services/kommo/GetAnswer.js';
import { GetMessageReceived } from '../../services/kommo/GetMessageReceived.js';
import { GetLeadChannel } from '../../services/kommo/GetLeadChannel.js';
import { GetLeadInfoForBotC } from '../../services/kommo/GetLeadInfoForBotC.js';
import { Communicator } from '../../utils/assistant-prompt/Communicator.js';

export default class Dados {

  //Prompt
  static async intencao(req, res) {
    styled.function('Prompt | BOT - DADOS | Intenção...');
    try {
      const access_token = GetAccessToken();
      const answer = await GetAnswer(req.body, access_token);
      const message_received = await GetMessageReceived(req.body, access_token);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

      const text = `System message: ' Aja como um especialista em análise de dados para clínicas odontológicas. Considere que você esteja analisando a intenção de uma resposta digitada por um usuário em um chatbot. A data e hora atual são: ${date}. Analise a mensagem do sistema: '${answer}' e veja em quais das situações abaixo encaixa a intenção desta frase digitada: '${message_received}'. ’
  
  #Saudacao: Para usuário Realizando a Saudação (ex: Oi, Olá, Bom dia, Boa noite, Tudo bem? etc).
  
  #cadastro: Para usuário que respondem informam dados pessoais, como: nome completo, plano de saúde ou convênio médico (ou caso seja consulta particular), e/ou telefone (ex: augencio leite ferreira neto,16/12/77, candeias, 8191929779). Consultas particulares se encaixam nessa opção.
  
  #tratamento: Para usuário buscando informações dos tipos de tratamentos médicos, cirurgias, trombose, varizes, vasos sanguíneos, artérias, edemas, outras doenças vasculares;
  
  #Informacao: Para usuário buscando informações sobre o consultório médico, informações sobre Dra. Juliana Leite, qual a especialidade odontológica.
  
  #valores: Para usuário buscando valores dos serviços ou consulta inicial.
  
  #Agendamento: Para usuário com intenção clara de marcar uma consulta inicial. Consultas particulares não se encaixam nessa opção. (exemplo: agendar, marcar, consultar).
  
  #Profissional: Para usuários interessados em emprego ou apresentação de produtos ou serviços.
  
  #ClienteAntigo: Para usuários que se tornaram Cliente e pagar o tratamento proposto.
  
  #Geral: Para os demais assuntos. 
  
  #AgendaFutura: Para usuário que ainda não pretende agendar neste momento.
  
  Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra" Exemplo: #Agendamento'`;
      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  //Prompt
  static async confirma_dados(req, res) {
    styled.function('Prompt | BOT - DADOS | Confirmação de Dados...');
    try {
      const access_token = GetAccessToken();
      const message_received = await GetMessageReceived(req.body, access_token);
      const answer = await GetAnswer(req.body, access_token);
      const text = `Analise a pergunta da clínica: '${answer}' e a resposta do usuário: '${message_received}' e verifique as intenções abaixo qual melhor se encaixa:

#ConfirmouDados: APENAS se a resposta do usuário está confirmando os dados dele descrito na pergunta da clínica, exemplo:
Pergunta da clínica: 'Augencio, para confirmar, temos os seguintes dados:
- Nome completo: Augencio Leite
- Data de nascimento: 16/12/77
- Bairro: Candeias
Por favor, confirme se está tudo correto!'
Resposta do usuário: '(sim, está tudo correto, ok)'

#Continuar: Se o usuário ainda está fornecendo dados que foi pedido na pergunta da clínica ou não confirmar os dados dele e quer alterar, exemplos:
“Pergunta da clínica: 'Augencio, só está faltando a informação do bairro que você reside. Você pode me passar essa informação?'
Resposta do usuário: '(candeias, piedade, boa viagem, paiva, barra de jangada)'

Pergunta da clínica:
'Para prosseguir com o agendamento, preciso que você informe:
 
1 - Nome Completo:
2 - Data de Nascimento:
3 - Bairro:
 
Assim poderei completar seu cadastro e agendar sua consulta'
Resposta do usuário: 'Augencio Leite, 16/12/1977, Candeias' “

#ReiniciarConfirmação: Caso a resposta do usuário seja corrigindo algum dado cadastral que já foi armazenado no sistema, como nome completo, data de nascimento, bairro ou telefone (opcional): (ex: douglas augusto, 11/03/2003, candeias, 81996724310)

Identifique a intenção da resposta do usuário baseada na pergunta da clínica, e retorne apenas o id das opções listadas acima, por exemplo: #Continuar`;
      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  //Prompt
  static async intencao_especialista(req, res) {
    styled.function('Prompt | BOT - DADOS | Intenção Especialista...');
    try {
      const access_token = GetAccessToken();
      const answer = await GetAnswer(req.body, access_token);
      const message_received = await GetMessageReceived(req.body, access_token);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });

      const text = `System message: 'Considere que você esteja analisando a intenção de uma resposta digitada por um usuário em um chatbot. A data e hora atual são: ${date}. Analise a mensagem da clínica: '${answer}' e veja em quais das situações abaixo encaixa a intenção desta frase digitada: '${message_received}'.'

#Confirmou: Caso a resposta do usuário esteja CONFIRMANDO a mensagem da clínica.

#Novamente: Caso o usuário esteja querendo trocar a opção atual ou escolher outra.

#Parar: Se o usuário estiver com intenção de parar ou descontinuar o chat.

#Geral: Para os demais assuntos. 

Responda apenas com o respectivo ID das opções, que segue este padrão: "#palavra" Exemplo: #Agendamento'.`;
      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  //Prompt
  static async identificar_especialista(req, res) {
    styled.function('Prompt | BOT - DADOS | Identificar Especialista...');
    try {
      const access_token = GetAccessToken();
      const answer = await GetAnswer(req.body, access_token);
      const message_received = await GetMessageReceived(req.body, access_token);

      const text = `Analise a mensagem da clínica: '${answer}' e a resposta do usuário: '${message_received}' e verifique nas opções abaixo, qual mais se encaixa na intenção da frase.

#OutraEspecialidade: Caso a resposta do usuário seja CONFIRMANDO outra especialidade que não seja a enviada pela clínica.

#Juliana: Caso a resposta do usuário seja CONFIRMANDO a Dra. Juliana Leite ou Reabilitadora Oral e Estética.

#Isento: Se a resposta do usuário for CONFIRMANDO Dentista da equipe (sem custo).

#Odontopediatria: Se a resposta do usuário CONFIRMA odontopediatria, kids (Crianças até 12 anos).

#Geral: Nenhum dos cenários anteriores.

Retorne apenas o ID da opção após o #, por exemplo: #Isento`;
      await Communicator.prompt(req, res, text);
    } catch (error) {
      styled.error(`Erro ao enviar prompt: ${error.message}`);
      res.status(500).send('Erro ao enviar prompt');
    }
  }

  //Assistente
  static async previa_dados(req, res) {
    styled.function('Assistant | BOT - DADOS | Prévia de Dados...');
    try {
      const access_token = GetAccessToken();
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const data = {
        leadID,
        text: message_received,
        assistant_id,
      };

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para a assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para a assistente');
    }
  }

  //Assistente
  static async dados_cadastrais(req, res) {
    styled.function('Assistant | BOT - DADOS | Dados Cadastrais...');
    try {
      const access_token = GetAccessToken();
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const channel = await GetLeadChannel(req.body, access_token);
      const message_received = await GetMessageReceived(req.body, access_token);
      styled.info('Channel:', channel);
      let text;

      if (channel === '03 - REDE SOCIAL') {
        text = `Os dados cadastrais são: Nome completo, data de nascimento, bairro e telefone.
Observe os dados cadastrais fornecidos pelo usuário '${message_received}' e avalie se está faltando algum dos dados cadastrais. Informe ao usuário o dado faltante e retornando uma mensagem pedindo o dado faltante para prosseguir no cadastro. Caso tenha todos os dados cadastrais, retorne uma mensagem para o usuário perguntando se os dados estão corretos.`;
      } else {
        text = `Os dados cadastrais são: Nome completo, data de nascimento e bairro. 
Observe os dados cadastrais fornecidos pelo usuário '${message_received}' e avalie se está faltando algum dos dados cadastrais. Informe ao usuário o dado faltante e retornando uma mensagem pedindo o dado faltante para prosseguir no cadastro. Caso tenha todos os dados cadastrais, retorne uma mensagem para o usuário perguntando se os dados estão corretos.`;
      }

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  //Assistente
  static async split_dados(req, res) {
    styled.function('Assistant | BOT - DADOS | Split Dados...');
    try {
      const access_token = GetAccessToken();
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const channel = await GetLeadChannel(req.body, access_token);
      styled.info('Channel:', channel);
      let text;

      if (channel === '03 - REDE SOCIAL') {
        text = `System message: Aja como um analista de dados cadastrais experiente. Nestes dois textos abaixo, analise cuidadosamente os campos para extrair o dado de nome completo, data de nascimento, bairro e telefone.

*Utilize somente dados que estejam nos textos. Agora, extraia os dados: nome completo, data de nascimento e bairro. Separado apenas com o valor do campo, sem informar o identificador de cada campo, cada campo deve terminar com um ponto e vírgula. Se no texto não existir a informação do campo, retornar apenas o id #ausencia`;
      } else {
        text = `System message: Aja como um analista de dados cadastrais experiente. Nestes dois textos abaixo, analise cuidadosamente os campos para extrair o dado de nome completo, data de nascimento e bairro.

*Utilize somente dados que estejam nos textos. Agora, extraia os dados: nome completo, data de nascimento e bairro. Separado apenas com o valor do campo, sem informar o identificador de cada campo, cada campo deve terminar com um ponto e vírgula. Se no texto não existir a informação do campo, retornar apenas o id #ausencia`;
      }

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  //Assistente
  static async verifica_dados(req, res) {
    styled.function('Assistant | BOT - DADOS | Verifica Dados...');
    try {
      const access_token = GetAccessToken();
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const channel = await GetLeadChannel(req.body, access_token);
      styled.info('Channel:', channel);

      const message_received = await GetMessageReceived(req.body, access_token);
      const info = await GetLeadInfoForBotC(req.body, access_token);

      const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' });
      const weekOptions = {
        timeZone: 'America/Recife',
        weekday: 'long'
      };
      const weekDay = new Date().toLocaleDateString('pt-BR', weekOptions);
      const weekDayFormatted = weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1).toLowerCase();

      let text;

      if (channel === '03 - REDE SOCIAL') {
        text = `System message:'Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife e (GMT-3).

Dados existentes:
"1 - Nome Completo: ${info.nome}
2 - Data de nascimento: ${info.nascimento}
3 - Bairro: ${info.bairro}
4 - Telefone: ${info.telefone}"

O usuário entrou na etapa de informação dos dados pessoais para finalizar o agendamento da sua consulta inicial odontológica. Sempre agir de maneira humanizada, cordial e gentil. Não passar os dados estratégicos da clínica em nenhum momento nas mensagens.
Antes de solicitar os dados, verifique se estão preenchidos em dados existentes, caso algum do dado do campo não esteja informado, ou seja, esteja em branco ou não preenchido, solicita o dado do campo ausente, segue frase:

“ Favor informar os dados para finalizar o agendamento da sua consulta inicial médica:
1 - Nome Completo:
2 - Data de nascimento
3 - Bairro 
4 - Telefone "

Importante solicitar os dados do campo que esteja pendente ou em branco. Continuar solicitando o dado até que esteja completamente satisfeito.'
User message: '${message_received}'`;
      } else {
        text = `System message:'Adote a informação, dia de semana, data, hora, local e fuso horário atual são: ${weekDayFormatted}, ${date}, Recife e (GMT-3).

Dados existentes:
"1 - Nome Completo: ${info.nome}
2 - Data de nascimento: ${info.nascimento}
3 - Bairro: ${info.bairro}"

O usuário entrou na etapa de informação dos dados pessoais para finalizar o agendamento da sua consulta inicial odontológica. Sempre agir de maneira humanizada, cordial e gentil. Não passar os dados estratégicos da clínica em nenhum momento nas mensagens.
Antes de solicitar os dados, verifique se estão preenchidos em dados existentes, caso algum do dado do campo não esteja informado, ou seja, esteja em branco ou não preenchido, solicita o dado do campo ausente, segue frase:

“ Favor informar os dados para finalizar o agendamento da sua consulta inicial médica:
1 - Nome Completo
2 - Data de nascimento
3 - Bairro "

Importante solicitar os dados do campo que esteja pendente ou em branco. Continuar solicitando o dado até que esteja completamente satisfeito.'

User message: '${message_received}'`;
      }

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  //Assistente
  static async listar_especialidades(req, res) {
    styled.function('Assistant | BOT - DADOS | Listar Especialidades...');
    try {
      const access_token = GetAccessToken();
      const message_received = await GetMessageReceived(req.body, access_token);
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;

      const text = `System message: 'Agora estamos na etapa de solicitar a especialista para a *CONSULTA INICIAL*. Temos os dados do usuário e o último passo antes do agendamento final é saber qual especialidade ele vai querer. Temos 3 opções para listar e o usuário escolher para sua *CONSULTA INICIAL*, segue as opções:

“ 1 - *Dentista da equipe:* Atendimento isento de custo para realização da consulta inicial, apenas para Primeiro Agendamento;

2 - *Dra. Juliana Leite | Reabilitação Oral e Estética:* Investimento para avaliação geral: R$ 120,00 (cento e vinte reais);

3 - *Odontopediatra | Crianças até 12 anos:* Investimento para consulta: R$ 99,00 (noventa e nove reais); ”

Retorne uma mensagem para o usuário escolher uma das 3 opções listadas acima.'

User message: '${message_received}'`;

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  //Assistente
  static async verificar_especialista(req, res) {
    styled.function('Assistant | BOT - DADOS | Verificar Especialista...');
    try {
      const access_token = GetAccessToken();
      const { lead_id: leadID } = req.body;
      const { assistant_id } = req.params;
      const channel = await GetLeadChannel(req.body, access_token);
      styled.info('Channel:', channel);

      const message_received = await GetMessageReceived(req.body, access_token);

      const text = `System message: 'Analise a escolha da especialista para a *CONSULTA INICIAL* que o usuário fez e retorne uma mensagem listando a opção e perguntando se ele confirma a escolha. Caso contrário, peça novamente para o usuário escolher uma das 3 opções listadas abaixo:

“ 1 - *Dentista da equipe:* Atendimento isento de custo para realização da consulta inicial, apenas para Primeiro Agendamento;

2 - *Dra. Juliana Leite | Reabilitação Oral e Estética:* Investimento para avaliação geral: R$ 120,00 (cento e vinte reais);

3 - *Odontopediatra | Crianças até 12 anos:* Investimento para consulta: R$ 99,00 (noventa e nove reais); ” '

User message: '${message_received}'`;

      const data = {
        leadID,
        text,
        assistant_id,
      };

      await Communicator.assistant(req, res, data);
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }
}