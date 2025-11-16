import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:6002';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const chartService = {
  async getBarChartData(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/chart/bar?${params}`);
    return response.data;
  },

  async getPieChartData(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/chart/pie?${params}`);
    return response.data;
  },

  async getChartData(chartType, filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/chart/${chartType}?${params}`);
    return response.data;
  }
};