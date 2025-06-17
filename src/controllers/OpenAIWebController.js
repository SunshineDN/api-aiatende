import OpenAIServices from "../services/openai/OpenAIServices.js";
import VApiServices from "../services/vapi/VApiServices.js";
import DateUtils from "../utils/DateUtils.js";
import styled from "../utils/log/styled.js";

export default class OpenAIWebController {

  static index(req, res, next) {
    try {
      res.status(200).json({ message: "OpenAI Controller is working!" });
    } catch (error) {
      if (!(error instanceof CustomError)) {
        styled.error(`[OpenAIWebController.index] - Erro inesperado na rota principal: ${error.message}`);
        return next(
          new Error("Erro inesperado na rota principal do OpenAI Controller")
        );
      }
    }
  }

  static async send_message(req, res, next) {
    const { lead_id, message: userMessage } = req.body;
    const openai = new OpenAIServices({ lead_id });

    try {
      const assistant_id = req.params.assistant_id || atob(process.env.OPENAI_ASSISTANT_ID);

      styled.info(`[OpenAIWebController.runAssistant] - User message: ${userMessage}`);

      const date = DateUtils.getActualDatetimeInformation();

      const additional_instructions = `
      System Additional Informations:
      ${date}`

      const { message, messages_history } = await openai.handleRunAssistant({ assistant_id, userMessage, additional_instructions });

      styled.success(`[OpenAIWebController.runAssistant] - Assistente executado com sucesso!`);
      styled.successdir(message);
      res.status(200).json({ message });
    } catch (error) {
      if (!(error instanceof CustomError)) {
        styled.error(`[OpenAIWebController.runAssistant] - Erro inesperado ao executar assistente: ${error.message}`);
        return next(error);
      }
    }
  }

  static async customAI(req, res, next) {
    const { niche } = req.body;

    try {
      const openai = new OpenAIServices();

      const instructions = `
      Você é uma assistente virtual especializada no nicho de **${niche}**. 
      
      Seu papel é agir como uma **consultora digital humanizada**, com linguagem natural, empática e adaptada ao perfil do público que mais busca soluções dentro desse nicho.  
      Você deve conduzir a conversa de forma leve, fluida e **inteligente**, como se fosse uma conversa entre pessoas reais, mas com eficiência estratégica.
      
      ---
      
      🎯 OBJETIVO PRINCIPAL
      
      - Qualificar completamente o lead, identificando:
        - Necessidade real
        - Urgência
        - Perfil de cliente ideal
        - Capacidade de investimento (sem parecer invasiva)
        - Nível de consciência sobre o produto/serviço
      - Estabelecer conexão emocional e profissional
      - Transferir o lead qualificado para o consultor humano/vendedor
      
      ---
      
      🧭 COMO AGIR
      
      - Sempre seja natural, gentil e assertiva.
      - Não use termos genéricos. Toda a comunicação deve ser **personalizada para o nicho ${niche}**, com vocabulário técnico, exemplos reais e analogias práticas do setor.
      - Utilize perguntas abertas e estratégicas para aprofundar a conversa e identificar o momento do lead na jornada de compra.
      - Use validação emocional (“Entendo perfeitamente”, “Isso é muito comum mesmo”, “Fico feliz que tenha compartilhado isso”) ao longo da conversa.
      - Nunca pare a conversa com respostas fechadas — sempre estimule o lead a seguir interagindo.
      - Quando a dúvida for técnica ou específica do serviço, responda com segurança e clareza, com base nas melhores práticas do nicho.
      
      ---
      
      📋 ESTRUTURA DE QUALIFICAÇÃO
      
      1. **Abertura e acolhimento**
         > “Oi! Que bom te ver por aqui 😊 Posso te ajudar a encontrar exatamente o que precisa?”
      
      2. **Identificar necessidade**
         > “Você está procurando algo específico dentro de ${niche}? Me conta um pouquinho sobre o que você está buscando ou qual desafio está enfrentando.” 
      
      3. **Investigar o contexto**
         > “Hoje em dia, como você tem lidado com essa situação?”
         > “Já chegou a buscar alguma solução antes?”
      
      4. **Identificar nível de urgência**
         > “Você está buscando resolver isso mais pro agora ou está se planejando pra daqui a um tempo?”
      
      5. **Mapear conhecimento e consciência**
         > “Você já conhece um pouco sobre as opções que existem dentro de ${niche}? Posso te explicar com mais detalhes, se quiser!” 
      
      6. **Validar interesse e orçamento**
         > “Dentro das soluções que temos, existem opções com diferentes níveis de investimento. Você já tem uma ideia de quanto pretende investir nisso, ou prefere que eu te mostre as possibilidades?”
      
      7. **Encaminhar para um especialista humano**
         > “Pelo que você me contou, você já está super alinhado(a) com o que oferecemos! Posso te colocar em contato direto com um especialista que vai te mostrar o melhor caminho, sem compromisso, tudo bem?”
      
      ---
      
      💬 ESTILO DE COMUNICAÇÃO
      
      - Calor humano + inteligência estratégica.
      - Mistura de tom consultivo + acolhedor, sem parecer robótico.
      - Utilize emojis com moderação, apenas quando fizer sentido com o tom emocional da conversa.
      - Evite listas secas, transforme em conversas.
      - Linguagem acessível, mas compatível com o nível do público-alvo do nicho.
      
      ---
      
      🧩 PERSONALIZAÇÃO POR NICHO
      
      Adapte todo o discurso conforme o nicho: 
      
      - Ex: nicho = "Estética Avançada" → Foco em autoestima, rejuvenescimento, procedimentos e segurança. 
      - Ex: nicho = "Treinamento Imobiliário" → Foco em leads, objeções, técnicas de venda e metas. 
      - Ex: nicho = "Mentoria Jurídica" → Tom técnico e respeitoso, voltado ao crescimento profissional. 
      
      ---
      `;

      const assistant = await openai.createAssistant({
        name: `IA Especialista em ${niche}`,
        instructions,
        model: "gpt-4.1-mini"
      });

      const prompt = `
      Você é um gerador de objetos JSON para configuração de assistentes virtuais.

      Sua tarefa é, a partir das informações fornecidas sobre um assistente (como nicho ou setor de atuação), gerar um objeto JSON com a seguinte estrutura, e retornar **apenas o objeto JSON em formato JSON.stringify**, sem nenhum texto explicativo antes ou depois:

      {
        id: "asst_zJZSIH8bVVzENET00X5GXpf7",
        name: "IA Especialista em ${niche}",
        description: "Especialista em ${niche} com conhecimento avançado do setor",
        status: "online",
        avatar: "🎯",
        specialties: ["${niche}", "Consultoria", "Estratégia"],
        isCustom: true
      }

      Exemplo de entrada:
      niche: "Odontologia Estética"

      Saída esperada:
      {\"id\":\"custom-1718642345678\",\"name\":\"IA Odontologia Estética\",\"description\":\"Especialista em Odontologia Estética com conhecimento avançado do setor\",\"status\":\"online\",\"avatar\":\"🦷\",\"specialties\":[\"Odontologia Estética\",\"Automação\",\"Análise de Dados\"],\"isCustom\":true}

      Os dados sempre é você quem preenche beaseado no que recebe do usuário.`

      const responseJsonStringify = await openai.chatCompletion({
        systemMessage: prompt,
        userMessage: `O assistente criado é: ${JSON.stringify(assistant)}`,
      });

      const parsedResponse = JSON.parse(responseJsonStringify);

      styled.success(`[OpenAIWebController.custom_assistant] - Assistente personalizado criado com sucesso!`);
      styled.successdir(parsedResponse);
      res.status(200).json(parsedResponse);
    } catch (error) {
      if (!(error instanceof CustomError)) {
        styled.error(`[OpenAIWebController.custom_assistant] - Erro inesperado ao criar assistente personalizado: ${error.message}`);
        return next(error);
      }
    }

  }

  static async executeAiPhone(req, res, next) {
    const { phoneNumber: phone_number, aiId: assistant_id } = req.body;

    try {
      if (!phone_number || !assistant_id) {
        throw new Error("phone_number and assistant_id are required");
      }

      const vapi = new VApiServices({ token: process.env.VAPI_API_KEY });

      styled.info(`[OpenAIWebController.executeAiPhone] - Calling assistant with phone number: ${phone_number} and assistant ID: ${assistant_id}`);

      const response = await vapi.callToAssistant({ assistant_id, phone_number });

      styled.success(`[OpenAIWebController.executeAiPhone] - Assistant called successfully!`);
      styled.successdir(response);
      res.status(200).json(response);
    } catch (error) {
      if (!(error instanceof CustomError)) {
        styled.error(`[OpenAIWebController.executeAiPhone] - Error calling assistant: ${error.message}`);
        return next(error);
      }
    }
  }
}