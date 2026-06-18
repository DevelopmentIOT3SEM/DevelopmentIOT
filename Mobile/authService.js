// src/services/authService.js
import api from './api';

export async function login(email, password) {
  try {
    const response = await api.post('/api/Auth/login', {
      email,
      password,
    });

    return response.data; // deve conter o token ou dados do usuário
  } catch (error) {
    // Você pode tratar os erros específicos da API aqui
    throw new Error(
      error.response?.data?.message || 'Erro ao fazer login'
    );
  }
}
