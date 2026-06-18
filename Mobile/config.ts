// Configuração de ambiente. Defina as variáveis em um arquivo `.env`
// (veja `.env.example`). No Expo, variáveis com prefixo EXPO_PUBLIC_ são
// embutidas no bundle em tempo de build.

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5271';

export const CHATBOT_URL =
  process.env.EXPO_PUBLIC_CHATBOT_URL ?? 'http://localhost:5000';
