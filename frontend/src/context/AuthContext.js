import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('newsflow_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authAPI.me();
      setUser(res.data.user);
    } catch (err) {
      localStorage.removeItem('newsflow_token');
      localStorage.removeItem('newsflow_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = async (username, email, password) => {
    setError(null);
    try {
      const res = await authAPI.register({ username, email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('newsflow_token', token);
      localStorage.setItem('newsflow_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Kayıt sırasında hata oluştu.';
      setError(message);
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('newsflow_token', token);
      localStorage.setItem('newsflow_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Giriş sırasında hata oluştu.';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('newsflow_token');
    localStorage.removeItem('newsflow_user');
    setUser(null);
    setError(null);
  };

  const updateUserPreferences = (preferences) => {
    setUser((prev) => ({ ...prev, preferences }));
    const storedUser = JSON.parse(localStorage.getItem('newsflow_user') || '{}');
    localStorage.setItem('newsflow_user', JSON.stringify({ ...storedUser, preferences }));
  };

  const clearError = () => setError(null);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        register,
        login,
        logout,
        updateUserPreferences,
        clearError,
        reloadUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
