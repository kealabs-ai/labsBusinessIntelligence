import axios from 'axios';
import { getApiUrl } from '../utils/envManager';

const API_URL = getApiUrl();

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const unitService = {
  async createUnit(unitData) {
    try {
      const response = await axios.post(`${API_URL}/api/v1/units`, unitData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar unidade:', error);
      throw error;
    }
  },

  async getUnits() {
    try {
      const response = await axios.get(`${API_URL}/api/v1/units`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
      throw error;
    }
  },

  async updateUnit(unitId, unitData) {
    try {
      const response = await axios.put(`${API_URL}/api/v1/units/${unitId}`, unitData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar unidade:', error);
      throw error;
    }
  },

  async deleteUnit(unitId) {
    try {
      const response = await axios.delete(`${API_URL}/api/v1/units/${unitId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir unidade:', error);
      throw error;
    }
  }
};