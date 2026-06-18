import axios from 'axios';
import type { Monitoramento, Producao, Sensor, Usuario } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5271';
const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL ?? 'http://localhost:5000';

const TOKEN_KEY = 'authToken';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const api = axios.create({ baseURL: API_URL });

// Injeta o token em toda requisição, quando presente.
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Em 401, limpa o token (sessão expirada/ inválida).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
    }
    return Promise.reject(error);
  },
);

// --- Auth ---
export async function login(email: string, senha: string): Promise<string> {
  const { data } = await api.post('/api/Auth/login', { email, senha });
  return data.token as string;
}

export async function registrar(nome: string, email: string, senha: string): Promise<void> {
  await api.post('/api/Auth/registrar', { nome, email, senha });
}

export async function getMe(): Promise<Usuario> {
  const { data } = await api.get<Usuario>('/api/Auth/me');
  return data;
}

// --- Produção / monitoramento ---
export async function getProducao(): Promise<Producao[]> {
  const { data } = await api.get<Producao[]>('/api/Producao');
  return data;
}

export async function getRefugos(): Promise<Producao[]> {
  const { data } = await api.get<Producao[]>('/api/Producao/refugos');
  return data;
}

export async function getSensores(): Promise<Sensor[]> {
  const { data } = await api.get<Sensor[]>('/api/Sensor');
  return data;
}

export async function getMonitoramentos(): Promise<Monitoramento[]> {
  const { data } = await api.get<Monitoramento[]>('/api/Monitoramento');
  return data;
}

// --- Chatbot ---
export async function perguntarChatbot(mensagem: string): Promise<string> {
  const { data } = await axios.post(`${CHATBOT_URL}/chat`, { mensagem });
  return (data.resposta as string) ?? 'Não consegui entender a resposta.';
}
