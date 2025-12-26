import { env } from '../utils/envManager';
import { authService } from './authService';

class InstanceService {
  constructor() {
    this.baseURL = env.get('REACT_APP_API_URL', 'http://72.60.140.128:6002');
  }

  async createInstance() {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    
    const response = await fetch(`${this.baseURL}/api/instance/create`, {
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
  }
}

export const instanceService = new InstanceService();
