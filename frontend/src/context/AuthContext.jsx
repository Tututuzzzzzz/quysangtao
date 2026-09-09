import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_info');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('user_info', JSON.stringify(res.data));
        } catch (err) {
          console.error("Token verification failed:", err);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (usernameOrEmail, password) => {
    const res = await api.post('/auth/login', { usernameOrEmail, password });
    const data = res.data;
    localStorage.setItem('jwt_token', data.token);
    const userInfo = {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      department: data.department,
      role: data.role,
      avatarUrl: data.avatarUrl
    };
    setUser(userInfo);
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    return userInfo;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    const data = res.data;
    localStorage.setItem('jwt_token', data.token);
    const userInfo = {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      department: data.department,
      role: data.role,
      avatarUrl: data.avatarUrl
    };
    setUser(userInfo);
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    return userInfo;
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    setUser(null);
  };

  const switchAccount = async (targetRole) => {
    if (targetRole === 'ROLE_ADMIN') {
      return login('admin', 'admin123');
    } else {
      return login('nvm', '123456');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
