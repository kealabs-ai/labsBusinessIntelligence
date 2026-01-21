import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://72.60.140.128:6002';

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
      // Validate required fields
      if (!unitData.unit_name || unitData.unit_name.trim() === '') {
        throw new Error('Nome da unidade é obrigatório');
      }
      
      // Get kea_client_id from current user session
      let keaClientId = unitData.kea_client_id;
      if (!keaClientId) {
        try {
          const currentUser = await authService.getCurrentUser();
          keaClientId = currentUser?.kea_client_id || null;
        } catch (error) {
          console.warn('Não foi possível obter kea_client_id da sessão');
        }
      }
      
      // Clean and validate data
      const cleanData = {
        ...unitData,
        unit_name: unitData.unit_name.trim(),
        kea_client_id: keaClientId,
        appointment_interval: parseInt(unitData.appointment_interval) || 30,
        notification_advance_hours: parseInt(unitData.notification_advance_hours) || 24
      };
      
      const response = await axios.post(`${API_URL}/api/v1/units`, cleanData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar unidade:', error.response?.data || error.message);
      throw error;
    }
  },

  async getUnits() {
    try {
      const response = await axios.get(`${API_URL}/api/v1/units`, {
        headers: getAuthHeaders()
      });
      // Ensure response is an array and sanitize data
      const units = Array.isArray(response.data) ? response.data : [];
      return units.map(unit => ({
        ...unit,
        id: unit.id || 0,
        unit_name: unit.unit_name || '',
        opening_time: unit.opening_time || '08:00:00',
        closing_time: unit.closing_time || '18:00:00'
      }));
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
      throw error;
    }
  },

  async updateUnit(unitId, unitData) {
    try {
      // Validate required fields
      if (!unitData.unit_name || unitData.unit_name.trim() === '') {
        throw new Error('Nome da unidade é obrigatório');
      }
      
      // Get kea_client_id from current user session if not provided
      let keaClientId = unitData.kea_client_id;
      if (!keaClientId) {
        try {
          const currentUser = await authService.getCurrentUser();
          keaClientId = currentUser?.kea_client_id || null;
        } catch (error) {
          console.warn('Não foi possível obter kea_client_id da sessão');
        }
      }
      
      // Clean and validate data
      const cleanData = {
        ...unitData,
        unit_name: unitData.unit_name.trim(),
        kea_client_id: keaClientId,
        appointment_interval: parseInt(unitData.appointment_interval) || 30,
        notification_advance_hours: parseInt(unitData.notification_advance_hours) || 24
      };
      
      const response = await axios.put(`${API_URL}/api/v1/units/${unitId}`, cleanData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar unidade:', error.response?.data || error.message);
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