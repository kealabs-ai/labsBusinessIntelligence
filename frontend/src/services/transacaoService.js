const API_BASE_URL = 'http://72.60.140.128:6002/api/v1';

class TransacaoService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/transacoes`;
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request(url, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        headers: this.getHeaders(),
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  }

  async getTransacoes(page = 1, limit = 10) {
    return this.request(`/?page=${page}&limit=${limit}`);
  }

  async getTransacao(transacaoId) {
    return this.request(`/${transacaoId}`);
  }

  async createTransacao(transacaoData) {
    return this.request('/', {
      method: 'POST',
      body: JSON.stringify(transacaoData)
    });
  }

  async updateTransacao(transacaoId, transacaoData) {
    return this.request(`/${transacaoId}/update`, {
      method: 'POST',
      body: JSON.stringify(transacaoData)
    });
  }

  async deleteTransacao(transacaoId) {
    return this.request(`/${transacaoId}`, {
      method: 'DELETE'
    });
  }

  async getResumoFinanceiro() {
    return this.request('/resumo');
  }
}

export const transacaoService = new TransacaoService();