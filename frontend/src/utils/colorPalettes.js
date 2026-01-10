export const COLOR_PALETTES = {
  KEA_LABS: {
    name: 'IA - cores KeaLabs',
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  CLOUD_DANCER: {
    name: 'Cloud Dancer (Pantone)',
    primary: '#f0f0f0',
    secondary: '#e8e8e8',
    accent: '#d0d0d0',
    background: '#fafafa',
    surface: '#ffffff',
    text: '#2c2c2c',
    textSecondary: '#757575',
    success: '#81c784',
    warning: '#ffb74d',
    error: '#e57373',
    gradient: 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)'
  },
  MONOCHROME_GRAY: {
    name: 'Tons de Cinza (Estilo monocromático)',
    primary: '#424242',
    secondary: '#616161',
    accent: '#9e9e9e',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#212121',
    textSecondary: '#757575',
    success: '#66bb6a',
    warning: '#ffa726',
    error: '#ef5350',
    gradient: 'linear-gradient(135deg, #424242 0%, #616161 100%)'
  },
  TRANSFORMATIVE_TEAL: {
    name: 'Transformative Teal (WGSN + Coloro)',
    primary: '#00695c',
    secondary: '#00897b',
    accent: '#26a69a',
    background: '#e0f2f1',
    surface: '#ffffff',
    text: '#263238',
    textSecondary: '#546e7a',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    gradient: 'linear-gradient(135deg, #00695c 0%, #00897b 100%)'
  },
  PURE_BLUE: {
    name: 'Azul Puro (Coral)',
    primary: '#1976d2',
    secondary: '#1565c0',
    accent: '#42a5f5',
    background: '#e3f2fd',
    surface: '#ffffff',
    text: '#0d47a1',
    textSecondary: '#1565c0',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
  },
  UNIVERSAL_KHAKI: {
    name: 'Universal Khaki (Sherwin-Williams)',
    primary: '#8d6e63',
    secondary: '#a1887f',
    accent: '#bcaaa4',
    background: '#efebe9',
    surface: '#ffffff',
    text: '#3e2723',
    textSecondary: '#5d4037',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    gradient: 'linear-gradient(135deg, #8d6e63 0%, #a1887f 100%)'
  },
  FIRE_ORANGE: {
    name: 'Laranja e Vermelho (Estilo vibrante/fogo)',
    primary: '#ff5722',
    secondary: '#f44336',
    accent: '#ff9800',
    background: '#fce4ec',
    surface: '#ffffff',
    text: '#bf360c',
    textSecondary: '#d84315',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    gradient: 'linear-gradient(135deg, #ff5722 0%, #f44336 100%)'
  }
};

export const getPaletteOptions = () => {
  return Object.keys(COLOR_PALETTES).map(key => ({
    value: key,
    label: COLOR_PALETTES[key].name
  }));
};