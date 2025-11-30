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
    const params = new URLSearchParams({ page, limit });
    if (search) params.append('search', search);
    if (dateFilter) params.append('date', dateFilter);
    
    return this.request(`/agendamentos?${params}`);
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
    return this.request(`/agendamentos/${id}`, {
      method: 'DELETE'
    });
  }

  async sendWhatsAppMessage(number, text) {
    return this.request('/communication/send-message-client', {
      method: 'POST',
      body: JSON.stringify({ number, text })
    });
  }

  async getContacts() {
    return this.request('/contacts');
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