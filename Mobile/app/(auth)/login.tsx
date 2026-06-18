import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { colors, font, radius } from '@/constants/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError((err as Error).message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Image source={require('../../assets/images/logo-mobile-.png')} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Bem-vindo de volta</Text>
              <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Não tem uma conta? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity disabled={isLoading}>
                  <Text style={styles.footerLink}>Cadastre-se</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 28, alignItems: 'center' },
  logo: { width: 200, height: 110, marginBottom: 12 },
  title: { fontFamily: font.bold, fontSize: 26, color: colors.slate900, marginBottom: 6 },
  subtitle: { fontFamily: font.regular, fontSize: 15, color: colors.slate500 },
  errorContainer: { backgroundColor: colors.red100, borderRadius: radius.sm, padding: 12, marginBottom: 16 },
  errorText: { fontFamily: font.regular, color: '#991b1b', fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontFamily: font.regular, color: colors.slate500, fontSize: 14 },
  footerLink: { fontFamily: font.bold, color: colors.green600, fontSize: 14 },
});
