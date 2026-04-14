import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await getMe();
        setUser(data.user);
      } catch {
        setUser({ id: 1, name: 'Aryan Mittal', email: 'aryan@amazonclone.com' });
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('amazon_token');
    setUser({ id: 1, name: 'Aryan Mittal', email: 'aryan@amazonclone.com' });
  };

  const loginUser = (userData, token) => {
    localStorage.setItem('amazon_token', token);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
