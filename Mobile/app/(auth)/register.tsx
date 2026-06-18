import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Recycle } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { colors, font, radius } from '@/constants/theme';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await register(name, email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError((err as Error).message || 'Falha no cadastro. Tente novamente.');
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
              <View style={styles.brand}>
                <Recycle size={28} color={colors.green600} />
                <Text style={styles.brandText}>EcoVida</Text>
              </View>
              <Text style={styles.title}>Criar conta</Text>
              <Text style={styles.subtitle}>Cadastre-se para começar</Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity disabled={isLoading}>
                  <Text style={styles.footerLink}>Entrar</Text>
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
  header: { marginBottom: 28 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  brandText: { fontFamily: font.bold, fontSize: 22, color: colors.green700 },
  title: { fontFamily: font.bold, fontSize: 26, color: colors.slate900, marginBottom: 6 },
  subtitle: { fontFamily: font.regular, fontSize: 15, color: colors.slate500 },
  errorContainer: { backgroundColor: colors.red100, borderRadius: radius.sm, padding: 12, marginBottom: 16 },
  errorText: { fontFamily: font.regular, color: '#991b1b', fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontFamily: font.regular, color: colors.slate500, fontSize: 14 },
  footerLink: { fontFamily: font.bold, color: colors.green600, fontSize: 14 },
});
