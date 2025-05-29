import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const baseUrl = Platform.OS === 'android' 
    ? 'http://10.0.2.2:5271' // <- Use 10.0.2.2 para Android emulador!
    : 'http://localhost:5271';

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    };
    loadToken();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post(`${baseUrl}/api/Auth/registrar`, {
        nome: name,
        email,
        senha: password,
      });
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${baseUrl}/api/Auth/login`, {
        email,
        senha: password,
      });

      const token = response.data.token;
      if (token) {
        await AsyncStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
      } else {
        throw new Error('Token não recebido.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ register, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
