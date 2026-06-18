import { Stack } from 'expo-router';

// O AuthProvider já envolve toda a aplicação em app/_layout.tsx;
// não deve ser duplicado aqui (geraria um contexto de auth separado).
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
