import axios from 'axios';

const API_BASE_URL = 'http://72.60.140.128:6002/api/v1';

class TransacaoService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/transacoes`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getTransacoes(page = 1, limit = 10) {
    const response = await this.api.get(`/?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getTransacao(transacaoId) {
    const response = await this.api.get(`/${transacaoId}`);
    return response.data;
  }

  async createTransacao(transacaoData) {
    const response = await this.api.post('/', transacaoData);
    return response.data;
  }

  async updateTransacao(transacaoId, transacaoData) {
    const response = await this.api.post(`/${transacaoId}/update`, transacaoData);
    return response.data;
  }

  async deleteTransacao(transacaoId) {
    const response = await this.api.delete(`/${transacaoId}`);
    return response.data;
  }

  async getResumoFinanceiro() {
    const response = await this.api.get('/resumo');
    return response.data;
  }
}

export const transacaoService = new TransacaoService();