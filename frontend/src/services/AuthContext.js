import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './authService';
import { styleManager } from '../utils/styleManager';

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
        const sessionDuration = 15 * 60 * 1000;
        
        if (now - parseInt(loginTime) > sessionDuration) {
          logout();
          return;
        }
        
        try {
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            styleManager.setAuthenticated(true);
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
    const interval = setInterval(checkSession, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('loginTime', Date.now().toString());
      localStorage.setItem('kea_client_id', response.kea_client_id || '');
      localStorage.setItem('role_id', response.role_id || '1');
      localStorage.setItem('unit_id', response.unit_id || '0');
      
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      styleManager.setAuthenticated(true);
      
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
    styleManager.setAuthenticated(false);
  };

  const hasPermission = (moduleId) => {
    if (!user || !user.role_id) {
      console.log(`hasPermission(${moduleId}): user ou role_id não encontrado`, user);
      return false;
    }
    
    const permissions = {
      1: ['agendamentos', 'clientes', 'caixa', 'servicos', 'recursos', 'configuracoes', 'unidades'],
      2: ['agendamentos', 'clientes', 'caixa', 'servicos', 'recursos', 'unidades', 'configuracoes'],
      3: ['agendamentos', 'clientes', 'caixa'],
      4: ['agendamentos']
    };
    
    const hasAccess = permissions[user.role_id]?.includes(moduleId) || false;
    console.log(`hasPermission(${moduleId}): role_id=${user.role_id}, hasAccess=${hasAccess}`);
    return hasAccess;
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