const API_BASE_URL = 'http://72.60.140.128:6002/api/v1';

class AgendaService {
  constructor() {
    this.baseURL = API_BASE_URL;
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
        if (response.status === 405) {
          console.warn(`Method not allowed for ${url}, trying without explicit method`);
          // Retry without explicit method for GET requests
          if (!options.method || options.method === 'GET') {
            const retryOptions = { ...options };
            delete retryOptions.method;
            const retryResponse = await fetch(`${this.baseURL}${url}`, {
              headers: this.getHeaders(),
              ...retryOptions
            });
            if (retryResponse.ok) {
              return await retryResponse.json();
            }
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  }

  async createAgendamento(agendamentoData) {
    return this.request('/agendamentos', {
      method: 'POST',
      body: JSON.stringify(agendamentoData)
    });
  }

  async getAgendamentos(page = 1, limit = 10, search = '', dateFilter = '') {
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.append('search', search);
      if (dateFilter) params.append('date', dateFilter);
      
      return await this.request(`/agendamentos?${params}`);
    } catch (error) {
      if (error.message.includes('405')) {
        console.warn('Agendamentos endpoint not available, returning empty data');
        return {
          items: [],
          total: 0,
          page: page,
          limit: limit,
          pages: 1
        };
      }
      throw error;
    }
  }

  async getAgendamento(id) {
    return this.request(`/agendamentos/${id}`);
  }

  async updateAgendamento(id, agendamentoData) {
    return this.request(`/agendamentos/${id}/update`, {
      method: 'POST',
      body: JSON.stringify(agendamentoData)
    });
  }

  async deleteAgendamento(id) {
    return this.request(`/agendamentos/${id}/delete`, {
      method: 'POST'
    });
  }

  async sendWhatsAppMessage(number, text) {
    return this.request('/communication/send-message-client', {
      method: 'POST',
      body: JSON.stringify({ number, text })
    });
  }

  async getContacts() {
    try {
      return await this.request('/contacts');
    } catch (error) {
      if (error.message.includes('405')) {
        console.warn('Contacts endpoint not available, returning empty data');
        return {
          success: true,
          data: []
        };
      }
      throw error;
    }
  }

  async getChatMessages(contactPhone) {
    return this.request('/communication/chat-client', {
      method: 'POST',
      body: JSON.stringify({
        where: {
          key: {
            remoteJid: `${contactPhone}@s.whatsapp.net`
          }
        }
      })
    });
  }
}

export const agendaService = new AgendaService();