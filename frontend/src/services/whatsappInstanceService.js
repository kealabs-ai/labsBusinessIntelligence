import { env } from '../utils/envManager';

class WhatsAppInstanceService {
  constructor() {
    this.baseURL = env.apiBaseUrl;
  }

  async createInstance(instanceData) {
    console.log('Enviando dados para API:', instanceData);
    console.log('URL:', `${this.baseURL}/api/v1/whatsapp-instances/`);
    
    const response = await fetch(`${this.baseURL}/api/v1/whatsapp-instances/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(instanceData)
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta:', errorText);
      throw new Error(`Erro ao salvar instância: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Instância salva com sucesso:', result);
    return result;
  }

  async getInstances(userId, keaClientId = null) {
    const params = new URLSearchParams({ user_id: userId });
    if (keaClientId) {
      params.append('kea_client_id', keaClientId);
    }

    const response = await fetch(`${this.baseURL}/api/v1/whatsapp-instances/?${params}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar instâncias: ${response.status}`);
    }

    return response.json();
  }
}

export const whatsappInstanceService = new WhatsAppInstanceService();