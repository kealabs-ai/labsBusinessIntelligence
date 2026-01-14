const API_BASE_URL = 'http://72.60.140.128:6002';

class ColorPaletteService {
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getColorPalette() {
    try {
      const keaClientId = localStorage.getItem('kea_client_id') || 'kea717687';
      const response = await fetch(`${API_BASE_URL}/api/v1/kea-clients/${keaClientId}`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        return 'KEA_LABS';
      }
      
      const data = await response.json();
      return data.color_palette || 'KEA_LABS';
    } catch (error) {
      console.warn('Failed to fetch color palette:', error);
      return 'KEA_LABS';
    }
  }
}

export const colorPaletteService = new ColorPaletteService();