const API_BASE_URL = 'http://72.60.140.128:6002/api/v1';

class ClientService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/clients`;
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

  async getClients() {
    return this.request('/');
  }

  async getClient(clientId) {
    return this.request(`/${clientId}`);
  }

  async createClient(clientData) {
    return this.request('/', {
      method: 'POST',
      body: JSON.stringify(clientData)
    });
  }

  async updateClient(clientId, clientData) {
    return this.request(`/${clientId}/update`, {
      method: 'POST',
      body: JSON.stringify(clientData)
    });
  }

  async updateClientStatus(clientId, status) {
    return this.request(`/${clientId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status })
    });
  }
}

export const clientService = new ClientService();