const API_BASE_URL = 'http://72.60.140.128:6002/api/v1';

class AuthService {
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: this.getHeaders(),
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }
}

export const authService = new AuthService();