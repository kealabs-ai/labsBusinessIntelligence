import { env } from '../utils/envManager';


class InstanceService {
  constructor() {
    this.baseURL = env.get('REACT_APP_EVOLUTION_API_URL', 'https://comunication-with-client-evolution-api.t37hka.easypanel.host');
  }

  async createInstance() {
    // Gera nome aleatório para a instância
    const random = Math.random().toString(36).substring(2, 8);
    const instanceName = `kea_${random}`;
    // Recupera API_KEY Evolution do .env
    const token = env.get('API_KEY', '');
    const apikey = env.get('API_KEY', '');
    const body = {
      instanceName,
      token,
      token_type: 'apiKey',
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS'
    };
    const response = await fetch(`${this.baseURL}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error('Erro ao criar instância');
    }
    return response.json();
  }
}

export const instanceService = new InstanceService();
