const API_BASE_URL = 'http://72.60.140.128:6002/api/v1';

class ServiceService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/services`;
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  }

  async getServices() {
    return this.request('/');
  }

  async getService(serviceId) {
    return this.request(`/${serviceId}`);
  }

  async createService(serviceData) {
    console.log('Sending service data to API:', serviceData);
    return this.request('/', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    });
  }

  async updateService(serviceId, serviceData) {
    return this.request(`/${serviceId}/update`, {
      method: 'POST',
      body: JSON.stringify(serviceData)
    });
  }

  async updateServiceStatus(serviceId, status) {
    return this.request(`/${serviceId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status })
    });
  }

  async getServiceCategories() {
    return this.request('/categories');
  }
}

export const serviceService = new ServiceService();