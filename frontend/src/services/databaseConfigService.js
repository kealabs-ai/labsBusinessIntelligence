import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://72.60.140.128:6002';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const databaseConfigService = {
  async getConfigurations() {
    const response = await api.get('/api/database-config-public');
    return response.data;
  },

  async testMysqlConnection(config) {
    const response = await api.post('/api/database-config/test-mysql-public', config);
    return response.data;
  },

  async testSqlServerConnection(config) {
    const response = await api.post('/api/database-config/test-sqlserver-public', config);
    return response.data;
  },

  async testEnvironmentConfig(config) {
    const response = await api.post('/api/database-config/test-environment', config);
    return response.data;
  },

  async saveMysqlConfig(config) {
    const response = await api.post('/api/database-config/mysql-public', config);
    return response.data;
  },

  async saveSqlServerConfig(config) {
    const response = await api.post('/api/database-config/sqlserver-public', config);
    return response.data;
  },

  async saveEnvironmentConfig(config) {
    const response = await api.post('/api/database-config/environment', config);
    return response.data;
  },

  async testOpenVpnConnection(config) {
    const response = await api.post('/api/database-config/test-openvpn', config);
    return response.data;
  },

  async saveOpenVpnConfig(config) {
    const response = await api.post('/api/database-config/openvpn', config);
    return response.data;
  }
};