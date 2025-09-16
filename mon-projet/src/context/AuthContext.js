import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [token]);
  
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const userData = { 
        id: response.data._id,
        username: response.data.username, 
        email: response.data.email,
        subscriptionExpiresAt: response.data.subscriptionExpiresAt,
        subscriptionStatus: response.data.subscriptionStatus
      };
      
      setUser(userData);
      setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);
      navigate('/profile');
    } catch (error) { throw error; }
  };
  
  const register = async (username, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { username, email, password });
      const userData = { 
        id: response.data._id,
        username: response.data.username,
        email: response.data.email,
        subscriptionExpiresAt: response.data.subscriptionExpiresAt,
        subscriptionStatus: response.data.subscriptionStatus
      };
      
      setUser(userData);
      setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);
      navigate('/profile');
    } catch (error) { throw error; }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- NEW FUNCTION ---
  // Fetches the user's updated data from the backend
  // and updates the global state and localStorage.
  const refreshUserProfile = async () => {
    try {
      console.log('Refreshing user profile...');
      const { data } = await api.get('/api/users/profile'); // Corrected URL
      const userData = {
        id: data._id,
        username: data.username,
        email: data.email,
        subscriptionExpiresAt: data.subscriptionExpiresAt,
        subscriptionStatus: data.subscriptionStatus,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('User profile refreshed:', userData);
    } catch (error) {
      console.error('Failed to refresh user profile', error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  };
  // -------------------------

  const value = { user, token, login, register, logout, refreshUserProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => { return useContext(AuthContext); };