import { env } from '../utils/envManager';

class WhatsAppInstanceService {
  constructor() {
    this.baseURL = env.apiBaseUrl;
  }

  async createInstance(instanceData) {
    const response = await fetch(`${this.baseURL}/whatsapp-instances/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(instanceData)
    });

    if (!response.ok) {
      throw new Error(`Erro ao salvar instância: ${response.status}`);
    }

    return response.json();
  }

  async getInstances(userId, keaClientId = null) {
    const params = new URLSearchParams({ user_id: userId });
    if (keaClientId) {
      params.append('kea_client_id', keaClientId);
    }

    const response = await fetch(`${this.baseURL}/whatsapp-instances/?${params}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar instâncias: ${response.status}`);
    }

    return response.json();
  }
}

export const whatsappInstanceService = new WhatsAppInstanceService();