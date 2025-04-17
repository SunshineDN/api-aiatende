import axios from "axios";

export default class EvolutionApiServices {
  #apiKey;
  #instance;
  #baseUrl = process.env.EVOLUTION_API_BASE_URL;

  /**
   * Construtor da classe EvolutionApiServices
   * 
   * @constructor
   * @param {object} options - Opções para inicializar a classe
   * @param {string} options.apiKey - Chave da API
   * @param {string} options.instance - Instância do Evolution
   */
  constructor({ apiKey, instance }) {
    this.#apiKey = apiKey;
    this.#instance = instance;
  }

  /**
   * Envia uma mensagem do Evolution API para um número específico
   * @param {Object} options - Opções para enviar a mensagem
   * @param {string} options.message - Mensagem a ser enviada
   * @param {string} options.number - Número do destinatário
   * 
   * @returns {Promise<Object>} - Resposta da API
   */
  async sendMessage({ message, number } = {}) {

    const text = `*Assistente Virtual - Gabriele:*

${message}`

    const options = {
      method: "POST",
      url: `${this.#baseUrl}/message/sendText/${this.#instance}`,
      headers: {
        "Content-Type": "application/json",
        apikey: this.#apiKey,
      },
      data: {
        text,
        number,
      }
    }

    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  /**
   * Envia um audio do Evolution API para um número específico
   * @param {Object} options - Opções para enviar o áudio
   * @param {string} options.audio - URL ou base64 do áudio a ser enviado
   * @param {string} options.number - Número do destinatário
   * 
   * @returns {Promise<Object>} - Resposta da API
   */
  async sendAudio({ audio, number } = {}) {
    const options = {
      method: "POST",
      url: `${this.#baseUrl}/message/sendWhatsappAudio/${this.#instance}`,
      headers: {
        "Content-Type": "application/json",
        apikey: this.#apiKey,
      },
      data: {
        audio,
        number,
        "encoding": false
      }
    }

    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      console.error("Error sending audio:", error);
      throw error;
    }
  }
}