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
        
        authService.getCurrentUser()
          .then(userData => {
            setUser(userData);
            setIsAuthenticated(true);
          })
          .catch(() => {
            logout();
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000); // Verifica a cada minuto
    
    return () => clearInterval(interval);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('loginTime', Date.now().toString());
      setUser({ id: response.user_id });
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