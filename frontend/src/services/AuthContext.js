import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './authService';

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
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('loginTime', Date.now().toString());
      
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
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