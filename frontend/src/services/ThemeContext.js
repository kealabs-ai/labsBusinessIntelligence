import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { COLOR_PALETTES } from '../utils/colorPalettes';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  const [currentPalette, setCurrentPalette] = useState('KEA_LABS');

  useEffect(() => {
    // Carregar paleta do cliente logado
    const keaClientId = localStorage.getItem('kea_client_id');
    if (keaClientId) {
      loadClientPalette(keaClientId);
    }
  }, []);

  const loadClientPalette = async (keaClientId) => {
    try {
      const response = await fetch(`http://72.60.140.128:6002/api/v1/kea-clients/${keaClientId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const client = await response.json();
        if (client.color_palette && COLOR_PALETTES[client.color_palette]) {
          setCurrentPalette(client.color_palette);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar paleta do cliente:', error);
    }
  };

  const updateClientPalette = async (keaClientId, paletteId) => {
    try {
      const response = await fetch(`http://72.60.140.128:6002/api/v1/kea-clients/${keaClientId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ color_palette: paletteId })
      });
      
      if (response.ok) {
        setCurrentPalette(paletteId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao atualizar paleta do cliente:', error);
      return false;
    }
  };

  const palette = COLOR_PALETTES[currentPalette];
  
  const theme = createTheme({
    palette: {
      primary: {
        main: palette.primary,
      },
      secondary: {
        main: palette.secondary,
      },
      background: {
        default: palette.background,
        paper: palette.surface,
      },
      text: {
        primary: palette.text,
        secondary: palette.textSecondary,
      },
      success: {
        main: palette.success,
      },
      warning: {
        main: palette.warning,
      },
      error: {
        main: palette.error,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: palette.gradient,
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ 
      currentPalette, 
      palette, 
      updateClientPalette,
      loadClientPalette 
    }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};