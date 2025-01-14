import styled from './log/styledLog.js';
import OpenAIController from '../controllers/OpenAIController.js';
import KommoOpenaiServices from '../services/kommo/KommoOpenaiServices.js';

export default class OpenaiIntegrationUtils {
  constructor() {
    this.kommoOpenaiServices = new KommoOpenaiServices({ auth: process.env.KOMMO_AUTH, url: process.env.KOMMO_URL });
  }

  async assistant(lead_id, data) {
    styled.function('[OpenaiIntegrationUtils.assistant] Enviando para o assistente GPT...');
    styled.info('[OpenaiIntegrationUtils.assistant] Mensagem enviada para o assistente:', data.text);

    const { message } = await OpenAIController.generateMessage(data);

    styled.success('[OpenaiIntegrationUtils.assistant] Resposta recebida do assistente:', message);

    return await this.kommoOpenaiServices.sendMessage({ lead_id, message });
  }

  async prompt(lead_id, text) {
    styled.function('[OpenaiIntegrationUtils.prompt] Enviando prompt...');
    styled.info('[OpenaiIntegrationUtils.prompt] Mensagem enviada para o prompt:', text);

    const { message } = await OpenAIController.promptMessage(text);

    styled.success('[OpenaiIntegrationUtils.prompt] Resposta recebida do prompt:', message);

    return await this.kommoOpenaiServices.sendMessage({ lead_id, message });
  }
};