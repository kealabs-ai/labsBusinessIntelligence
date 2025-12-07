import axios from 'axios';

const API_URL = 'http://72.60.140.128:6002';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const roleService = {
  async getRoles() {
    try {
      const response = await axios.get(`${API_URL}/api/v1/roles`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar roles:', error);
      throw error;
    }
  }
};