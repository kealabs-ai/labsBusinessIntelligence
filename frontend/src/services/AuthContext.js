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
    const checkSession = () => {
      const token = localStorage.getItem('token');
      const loginTime = localStorage.getItem('loginTime');
      
      if (token && loginTime) {
        const now = Date.now();
        const sessionDuration = 15 * 60 * 1000; // 15 minutos
        
        if (now - parseInt(loginTime) > sessionDuration) {
          logout();
          return;
        }
        
        const userData = decodeToken(token);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
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
      
      const userData = decodeToken(response.access_token);
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

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};