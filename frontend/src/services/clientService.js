import axios from 'axios';

const API_BASE_URL = 'http://72.60.140.128:6002/api/v1';

class ClientService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/clients`,
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

  async getClients() {
    const response = await this.api.get('/');
    return response.data;
  }

  async getClient(clientId) {
    const response = await this.api.get(`/${clientId}`);
    return response.data;
  }

  async createClient(clientData) {
    const response = await this.api.post('/', clientData);
    return response.data;
  }

  async updateClient(clientId, clientData) {
    const response = await this.api.post(`/${clientId}/update`, clientData);
    return response.data;
  }

  async updateClientStatus(clientId, status) {
    const response = await this.api.post(`/${clientId}/status`, { status });
    return response.data;
  }
}

export const clientService = new ClientService();