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
      const response = await api.post('/auth/login', { email, password });
      const userData = { 
        id: response.data._id,
        username: response.data.username, 
        email: response.data.email,
        isSubscribed: response.data.isSubscribed
      };
      
      setUser(userData);
      setToken(response.data.token);

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);
      
      navigate('/profile');
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };
  
  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const userData = { 
        id: response.data._id,
        username: response.data.username,
        email: response.data.email,
        isSubscribed: response.data.isSubscribed
      };
      
      setUser(userData);
      setToken(response.data.token);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);

      navigate('/profile');
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const updateUserSubscriptionStatus = () => {
    if (user) {
      const updatedUser = { ...user, isSubscribed: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = { user, token, login, register, logout, updateUserSubscriptionStatus };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};