import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated, ready } = useAuth();

  if (!ready) return null; // evita "piscar" o redirect antes de ler o token

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
