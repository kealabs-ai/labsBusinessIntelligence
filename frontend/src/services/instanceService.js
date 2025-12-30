import { env } from '../utils/envManager';
import { authService } from './authService';

class InstanceService {
  constructor() {
    this.baseURL = env.apiBaseUrl;
    console.log('InstanceService baseURL:', this.baseURL);
  }

  async createInstance() {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    
    const url = `${this.baseURL}/api/instance/create`;
    console.log('Chamando URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erro ao criar instância: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique se o servidor está acessível.');
      }
      throw error;
    }
  }
}

export const instanceService = new InstanceService();
