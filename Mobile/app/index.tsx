import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function IndexPage() {
  const { isAuthenticated } = useAuth();

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}