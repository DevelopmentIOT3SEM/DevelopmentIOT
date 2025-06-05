import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter,  } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
  try {
    setIsLoading(true);
    setError(null);
    console.log('Tentando logar...');
    await login(email, password);
    console.log('Login feito, navegando...');
    router.replace('/(tabs)');
  } catch (err) {
    setError('Falha no login. Por favor, verifique suas credenciais.');
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>

            <View style={styles.header}>
                <Image
                    source={require('../../assets/images/logo-mobile-.png')} 
                    style={styles.logo}
                />
              <Text style={styles.title}>Bem-vindo de volta</Text>
              <Text style={styles.subtitle}>Entre na sua conta</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#151313',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
  },
  errorContainer: {
    backgroundColor: '#FFDDE0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    color: '#E11D48',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    fontSize: 14,
  },
  footerLink: {
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    fontSize: 14,
  },
  logo: {
    width: 260,
    height: 130,
    alignSelf: 'center',
    marginBottom: 25
  }
});