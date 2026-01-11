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

  const loadClientPalette = async (keaClientId) => {
    try {
      const token = localStorage.getItem('token');
      const roleId = localStorage.getItem('role_id');
      if (!token || !keaClientId || keaClientId === '') return;
      
      // Aguardar um pouco para garantir que o token seja válido
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Se não for admin, usar paleta padrão
      if (roleId !== '1') {
        console.log('Usuário não é admin - usando paleta padrão');
        setCurrentPalette('KEA_LABS');
        return;
      }
      
      const response = await fetch(`http://72.60.140.128:6002/api/v1/kea-clients/${keaClientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const client = await response.json();
        console.log('Cliente carregado:', client);
        if (client.color_palette && COLOR_PALETTES[client.color_palette]) {
          console.log('Aplicando paleta:', client.color_palette);
          setCurrentPalette(client.color_palette);
        }
      } else {
        console.log('Erro ao carregar cliente - usando paleta padrão');
        setCurrentPalette('KEA_LABS');
      }
    } catch (error) {
      console.error('Erro ao carregar paleta do cliente:', error);
      setCurrentPalette('KEA_LABS');
    }
  };

  useEffect(() => {
    const keaClientId = localStorage.getItem('kea_client_id');
    if (keaClientId && keaClientId !== '') {
      loadClientPalette(keaClientId);
    }
    
    // Listener para evento customizado de atualização de tema
    const handleThemeUpdate = () => {
      const newKeaClientId = localStorage.getItem('kea_client_id');
      if (newKeaClientId && newKeaClientId !== '') {
        loadClientPalette(newKeaClientId);
      }
    };
    
    window.addEventListener('themeUpdate', handleThemeUpdate);
    return () => window.removeEventListener('themeUpdate', handleThemeUpdate);
  }, []);

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
      MuiButton: {
        styleOverrides: {
          contained: {
            background: palette.gradient,
            '&:hover': {
              background: palette.primary,
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ 
        currentPalette, 
        palette,
        loadClientPalette,
        setCurrentPalette
      }}>
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};