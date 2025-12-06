class EnvManager {
  static instance = null;

  constructor() {
    if (EnvManager.instance) {
      return EnvManager.instance;
    }
    EnvManager.instance = this;
  }

  get(key, defaultValue = null) {
    return process.env[key] || defaultValue;
  }

  getRequired(key) {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Required environment variable '${key}' not found`);
    }
    return value;
  }

  getBool(key, defaultValue = false) {
    const value = this.get(key);
    if (value === null) return defaultValue;
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  }

  getInt(key, defaultValue = null) {
    const value = this.get(key);
    if (value === null) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  // API configurations
  get apiBaseUrl() {
    return this.get('REACT_APP_API_URL', 'http://72.60.140.128:6002');
  }

  get apiTimeout() {
    return this.getInt('REACT_APP_API_TIMEOUT', 10000);
  }

  // Feature flags
  get enableDebugMode() {
    return this.getBool('REACT_APP_DEBUG_MODE', false);
  }

  get enableAnalytics() {
    return this.getBool('REACT_APP_ENABLE_ANALYTICS', false);
  }
}

// Global instance
export const env = new EnvManager();

// Export getApiUrl function for backward compatibility
export const getApiUrl = () => env.apiBaseUrl;