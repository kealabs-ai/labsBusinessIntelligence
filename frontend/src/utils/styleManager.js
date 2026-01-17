import { colorPaletteService } from '../services/colorPaletteService';

class StyleManager {
  constructor() {
    this.palette = null;
    this.isLoading = false;
    this.listeners = new Set();
    this.pollInterval = null;
    this.lastCheck = null;
    this.isAuthenticated = false;
  }

  setAuthenticated(authenticated) {
    this.isAuthenticated = authenticated;
    if (!authenticated) {
      this.stopPolling();
      this.clearCache();
    }
  }

  async getColorPalette() {
    if (!this.isAuthenticated) {
      return 'KEA_LABS';
    }

    if (this.palette && !this.shouldRefresh()) {
      return this.palette;
    }

    if (this.isLoading) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (!this.isLoading) {
            resolve(this.palette || 'KEA_LABS');
          } else {
            setTimeout(checkLoaded, 50);
          }
        };
        checkLoaded();
      });
    }

    return this.fetchPalette();
  }

  async fetchPalette() {
    if (!this.isAuthenticated) {
      return 'KEA_LABS';
    }

    this.isLoading = true;
    try {
      const newPalette = await colorPaletteService.getColorPalette();
      if (newPalette !== this.palette) {
        this.palette = newPalette;
        this.notifyListeners();
      }
      this.lastCheck = Date.now();
      this.startPolling();
      return this.palette;
    } catch (error) {
      this.palette = 'KEA_LABS';
      return this.palette;
    } finally {
      this.isLoading = false;
    }
  }

  shouldRefresh() {
    return !this.lastCheck || (Date.now() - this.lastCheck) > 30000;
  }

  startPolling() {
    if (this.pollInterval || !this.isAuthenticated) return;
    
    this.pollInterval = setInterval(async () => {
      if (!this.isAuthenticated) {
        this.stopPolling();
        return;
      }
      
      try {
        const newPalette = await colorPaletteService.getColorPalette();
        if (newPalette !== this.palette) {
          this.palette = newPalette;
          this.notifyListeners();
        }
      } catch (error) {
        console.warn('Failed to poll color palette:', error);
      }
    }, 30000);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0) {
        this.stopPolling();
      }
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.palette));
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  clearCache() {
    this.palette = null;
    this.lastCheck = null;
  }
}

export const styleManager = new StyleManager();