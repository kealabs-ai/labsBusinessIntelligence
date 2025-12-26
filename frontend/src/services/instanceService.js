import { env } from '../utils/envManager';


class InstanceService {
  constructor() {
    this.baseURL = env.get('REACT_APP_EVOLUTION_API_URL', 'https://comunication-with-client-evolution-api.t37hka.easypanel.host');
  }

  async createInstance() {
    // Gera nome aleatório para a instância
    const random = Math.random().toString(36).substring(2, 8);
    const instanceName = `kea_${random}`;
    // Recupera API_KEY Evolution do envManager
    const apikey = env.evolutionApiKey;
    
    // Validação da API key
    if (!apikey) {
      throw new Error('Evolution API Key não encontrada. Verifique se REACT_APP_EVOLUTION_API_KEY está definida no .env');
    }
    
    const body = {
      instanceName,
      token: apikey,
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
      throw new Error(`Erro ao criar instância: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    // Adiciona o instanceName na resposta para uso posterior
    result.instanceName = instanceName;
    return result;
  }
}

export const instanceService = new InstanceService();
