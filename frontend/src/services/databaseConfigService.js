const API_BASE_URL = 'http://72.60.140.128:6002';

class DatabaseConfigService {
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

  async getConfigurations() {
    return this.request('/api/database-config-public');
  }

  async testMysqlConnection(config) {
    return this.request('/api/database-config/test-mysql-public', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async testSqlServerConnection(config) {
    return this.request('/api/database-config/test-sqlserver-public', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async testEnvironmentConfig(config) {
    return this.request('/api/database-config/test-environment', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async saveMysqlConfig(config) {
    return this.request('/api/database-config/mysql-public', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async saveSqlServerConfig(config) {
    return this.request('/api/database-config/sqlserver-public', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async saveEnvironmentConfig(config) {
    return this.request('/api/database-config/environment', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async testOpenVpnConnection(config) {
    return this.request('/api/database-config/test-openvpn', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async saveOpenVpnConfig(config) {
    return this.request('/api/database-config/openvpn', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }
}

export const databaseConfigService = new DatabaseConfigService();