import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProductionItem {
  idProducao: number;
  idPcca: number;
  rampa: number;
  timestampProducao: string;
}

interface AuthContextType {
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  user: { name: string } | null;
  fetchProductionData: () => Promise<ProductionItem[]>;
  fetchRejectedData: () => Promise<ProductionItem[]>;
}

const baseUrl = 'http://52.44.49.80:5271';


const AuthContext = createContext<AuthContextType>({
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  user: null,
  fetchProductionData: async () => [],
  fetchRejectedData: async () => [],
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const loadTokenAndUser = async () => {
      const token = await AsyncStorage.getItem('token');
      const userName = await AsyncStorage.getItem('userName');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
      }
      if (userName) {
        setUser({ name: userName });
      }
    };
    loadTokenAndUser();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post(`${baseUrl}/api/Auth/registrar`, {
        nome: name,
        email,
        senha: password,
      });

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao registrar:', error.response?.data);
      } else {
        console.error('Erro inesperado:', error);
      }
      throw error;
    }
  };

const login = async (email: string, password: string) => {
  try {
    console.log('Tentando logar com:', { email, senha: password });

    const response = await axios.post(`${baseUrl}/api/Auth/login`, {
      email,
      senha: password,
    });

    console.log('Resposta completa:', response);

    const token = response.data.token;

    if (token) {
      await AsyncStorage.setItem('token', token);
      // Como não vem nome, pode deixar como "Usuário" genérico ou null
      await AsyncStorage.setItem('userName', 'Usuário');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ name: 'Usuário' });
      setIsAuthenticated(true);
    } else {
      throw new Error('Token não recebido.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro de Axios: ', error.response?.status, error.response?.data);
      throw new Error(error.response?.data?.message || 'Falha no login. Por favor, verifique suas credenciais.');
    } else {
      console.error('Erro inesperado:', error);
      throw new Error('Erro inesperado ao fazer login.');
    }
  }
};



  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userName');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  const fetchProductionData = async (): Promise<ProductionItem[]> => {
    try {
      const response = await axios.get(`${baseUrl}/api/Producao`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados de produção:', error);
      throw error;
    }
  };

  const fetchRejectedData = async (): Promise<ProductionItem[]> => {
    try {
      const response = await axios.get(`${baseUrl}/api/Producao/refugos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados de refugos:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        logout,
        isAuthenticated,
        user,
        fetchProductionData,
        fetchRejectedData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
