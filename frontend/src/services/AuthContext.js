import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './authService';
import { useTheme } from './ThemeContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      const loginTime = localStorage.getItem('loginTime');
      
      if (token && loginTime) {
        const now = Date.now();
        const sessionDuration = 15 * 60 * 1000; // 15 minutos
        
        if (now - parseInt(loginTime) > sessionDuration) {
          logout();
          return;
        }
        
        try {
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000); // Verifica a cada minuto
    
    return () => clearInterval(interval);
  }, []);

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: parseInt(payload.sub),
        role: payload.role || 'user',
        is_active: payload.is_active
      };
    } catch (error) {
      return null;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      console.log('Login response:', response);
      console.log('kea_client_id from response:', response.kea_client_id);
      console.log('role_id from response:', response.role_id);
      console.log('unit_id from response:', response.unit_id);
      
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('loginTime', Date.now().toString());
      localStorage.setItem('kea_client_id', response.kea_client_id || '');
      localStorage.setItem('role_id', response.role_id || '1');
      localStorage.setItem('unit_id', response.unit_id || '0');
      
      console.log('Saved to localStorage - kea_client_id:', localStorage.getItem('kea_client_id'));
      
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      
      // Disparar evento customizado para atualizar tema
      window.dispatchEvent(new Event('themeUpdate'));
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('kea_client_id');
    localStorage.removeItem('role_id');
    localStorage.removeItem('unit_id');
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (moduleId) => {
    if (!user || !user.role_id) return false;
    
    const permissions = {
      1: ['agendamentos', 'clientes', 'caixa', 'servicos', 'recursos', 'configuracoes'], // Administrador
      2: ['agendamentos', 'clientes', 'caixa', 'servicos', 'recursos'], // Gerente
      3: ['agendamentos', 'clientes', 'caixa'], // Recepcionista
      4: ['agendamentos'] // Profissional
    };
    
    return permissions[user.role_id]?.includes(moduleId) || false;
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};