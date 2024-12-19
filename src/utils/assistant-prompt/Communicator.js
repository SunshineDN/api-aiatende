import styled from '../log/styledLog.js';
import OpenAIController from '../../controllers/OpenAIController.js';
import { SendLog } from '../../services/kommo/SendLog.js';
import { SendMessage } from '../../services/kommo/SendMessage.js';

export class Communicator {
  static async assistant(req, res, data) {
    let access_token;
    try {
      styled.info('Enviando para o assistente GPT...');
      access_token = process.env.ACCESS_TOKEN;
      styled.info('Mensagem enviada para o assistente:', data.text);
      const { message } = await OpenAIController.generateMessage(data);
      styled.success('Resposta recebida do assistente:', message);
      await SendMessage(req.body, true, message, access_token);
      res.status(200).send({ message: 'Mensagem enviada com sucesso para o assistente', response: message });
    } catch (error) {
      styled.error(`Erro ao enviar mensagem para o assistente: ${error.message}`);
      await SendLog(req.body, `Erro ao enviar mensagem para o assistente: ${error.message}`, access_token);
      res.status(500).send('Erro ao enviar mensagem para o assistente');
    }
  }

  static async prompt(req, res, text) {
    let access_token;
    try {
      styled.info('Enviando prompt...');
      access_token = process.env.ACCESS_TOKEN;
      styled.info('Mensagem enviada para o prompt:', text);
      const { message } = await OpenAIController.promptMessage(text);
      styled.success('Resposta recebida do prompt:', message);
      await SendMessage(req.body, false, message, access_token);
      res.status(200).send({ message: 'Prompt enviado com sucesso', response: message });
    } catch (error) {
      styled.error(`Erro ao enviar prompt: ${error.message}`);
      await SendLog(req.body, `Erro ao enviar prompt: ${error.message}`, access_token);
      res.status(500).send('Erro ao enviar prompt');
    }
  }
};