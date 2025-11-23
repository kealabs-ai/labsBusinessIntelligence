import axios from 'axios';

const API_BASE_URL =  'http://localhost:6002/api/v1';

console.log('API_BASE_URL:', API_BASE_URL);

class AgendaService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('Request config:', {
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`
      });
      return config;
    });
  }

  async createAgendamento(agendamentoData) {
    try {
      const url = `${API_BASE_URL}/agendamentos`;
      console.log('Creating agendamento with URL:', url);
      console.log('Agendamento data:', agendamentoData);
      const response = await axios.post(url, agendamentoData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating agendamento:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Full error:', error.response || error);
      throw error;
    }
  }

  async getAgendamentos(page = 1, limit = 10, search = '') {
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.append('search', search);
      
      const url = `${API_BASE_URL}/agendamentos?${params}`;
      console.log('Fetching agendamentos with URL:', url);
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching agendamentos:', error);
      throw error;
    }
  }

  async getAgendamento(id) {
    try {
      const url = `${API_BASE_URL}/agendamentos/${id}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching agendamento:', error);
      throw error;
    }
  }

  async updateAgendamento(id, agendamentoData) {
    try {
      const url = `${API_BASE_URL}/agendamentos/${id}`;
      const response = await axios.post(url, agendamentoData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating agendamento:', error);
      throw error;
    }
  }

  async deleteAgendamento(id) {
    try {
      const url = `${API_BASE_URL}/agendamentos/${id}`;
      const response = await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting agendamento:', error);
      throw error;
    }
  }

  async sendWhatsAppMessage(number, text) {
    try {
      const url = `${API_BASE_URL}/communication/send-message-client`;
      const response = await axios.post(url, {
        number,
        text
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async getContacts() {
    try {
      const url = `${API_BASE_URL}/contacts`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async getChatMessages(contactPhone) {
    try {
      const url = `${API_BASE_URL}/communication/chat-client`;
      const response = await axios.post(url, {
        where: {
          key: {
            remoteJid: `${contactPhone}@s.whatsapp.net`
          }
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  }
}

export const agendaService = new AgendaService();