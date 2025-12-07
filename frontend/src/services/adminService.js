const API_BASE_URL = 'http://72.60.140.128:6002/api/v1';

class AdminService {
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

  async getUsers(page = 1, limit = 10) {
    return this.request(`/admin/users?page=${page}&limit=${limit}`);
  }

  async createUser(userData) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/admin/users/${userId}`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'POST'
    });
  }

  async getModules() {
    return this.request('/admin/modules');
  }

  async getUserPermissions(userId) {
    return this.request(`/admin/permissions/${userId}`);
  }

  async updateUserPermissions(userId, permissions) {
    return this.request(`/admin/permissions/${userId}`, {
      method: 'POST',
      body: JSON.stringify(permissions)
    });
  }

  async getUnits() {
    return this.request('/admin/units');
  }
}

export const adminService = new AdminService();