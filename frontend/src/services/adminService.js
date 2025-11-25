import axios from 'axios';

const API_BASE_URL = 'http://localhost:6002/api/v1';

class AdminService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getUsers(page = 1, limit = 10) {
    const response = await this.api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  }

  async createUser(userData) {
    const response = await this.api.post('/admin/users', userData);
    return response.data;
  }

  async updateUser(userId, userData) {
    const response = await this.api.put(`/admin/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId) {
    const response = await this.api.delete(`/admin/users/${userId}`);
    return response.data;
  }

  async getModules() {
    const response = await this.api.get('/admin/modules');
    return response.data;
  }

  async getUserPermissions(userId) {
    const response = await this.api.get(`/admin/permissions/${userId}`);
    return response.data;
  }

  async updateUserPermissions(userId, permissions) {
    const response = await this.api.post(`/admin/permissions/${userId}`, permissions);
    return response.data;
  }
}

export const adminService = new AdminService();