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
      if (!token || !keaClientId || keaClientId === '') return;
      
      console.log('Carregando paleta para cliente:', keaClientId);
      console.log('Token:', token ? `${token.substring(0, 20)}...` : 'Não encontrado');
      
      // Buscar cliente diretamente por kea_client_id
      const clientResponse = await fetch(`http://72.60.140.128:6002/api/v1/kea-clients/${keaClientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Status da resposta:', clientResponse.status);
      console.log('Headers da resposta:', clientResponse.headers);
      
      if (clientResponse.ok) {
        const client = await clientResponse.json();
        console.log('Cliente carregado:', client);
        
        if (client && client.color_palette && COLOR_PALETTES[client.color_palette]) {
          console.log('Aplicando paleta:', client.color_palette);
          setCurrentPalette(client.color_palette);
        } else {
          console.log('Cliente sem paleta - usando padrão');
          setCurrentPalette('KEA_LABS');
        }
      } else {
        const errorText = await clientResponse.text();
        console.log('Erro na resposta:', errorText);
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