const API_BASE_URL = 'http://72.60.140.128:6002/api/v1';

class ChartService {
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

  async getBarChartData(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/chart/bar?${params}`);
  }

  async getPieChartData(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/chart/pie?${params}`);
  }

  async getChartData(chartType, filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/chart/${chartType}?${params}`);
  }

  async getLineChartData(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/chart/line?${params}`);
  }

  async getAreaChartData(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/chart/area?${params}`);
  }

  async getScatterChartData(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/chart/scatter?${params}`);
  }

  async getKPIData(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/chart/kpi?${params}`);
  }
}

export const chartService = new ChartService();