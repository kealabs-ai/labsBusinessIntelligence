import axios from 'axios';

const API_URL = 'http://72.60.140.128:6002';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const keaClientService = {
  async createKeaClient(clientData) {
    try {
      const response = await axios.post(`${API_URL}/api/v1/kea-clients`, clientData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente KEA:', error);
      throw error;
    }
  },

  async getKeaClients() {
    try {
      const response = await axios.get(`${API_URL}/api/v1/kea-clients`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar clientes KEA:', error);
      throw error;
    }
  },

  async getKeaClient(clientId) {
    try {
      const response = await axios.post(`${API_URL}/api/v1/kea-clients/${clientId}`, {
        _method: 'GET'
      }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cliente KEA específico:', error);
      throw error;
    }
  },

  async updateKeaClient(clientId, clientData) {
    try {
      const response = await axios.post(`${API_URL}/api/v1/kea-clients/${clientId}`, {
        ...clientData,
        _method: 'PUT'
      }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar cliente KEA:', error);
      throw error;
    }
  },

  async deleteKeaClient(clientId) {
    try {
      const response = await axios.post(`${API_URL}/api/v1/kea-clients/${clientId}/delete`, {}, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir cliente KEA:', error);
      throw error;
    }
  }
};