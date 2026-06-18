import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { login as apiLogin, registrar as apiRegistrar, tokenStorage } from '@/services/api';

interface AuthContextValue {
  isAuthenticated: boolean;
  ready: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(tokenStorage.get()));
    setReady(true);
  }, []);

  const login = async (email: string, senha: string) => {
    const token = await apiLogin(email, senha);
    tokenStorage.set(token);
    setIsAuthenticated(true);
  };

  const registrar = async (nome: string, email: string, senha: string) => {
    await apiRegistrar(nome, email, senha);
  };

  const logout = () => {
    tokenStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, ready, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}
