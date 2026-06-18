import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors, font, radius } from '@/constants/theme';

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => void;
  isLoading: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    if (!name) {
      setNameError('Nome é obrigatório');
      isValid = false;
    } else if (name.length < 2) {
      setNameError('Nome deve ter pelo menos 2 caracteres');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email) {
      setEmailError('E-mail é obrigatório');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('E-mail inválido');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Senha é obrigatória');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      isValid = false;
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) onSubmit(name, email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={[styles.input, nameError ? styles.inputError : null]}
          placeholder="Ex.: Luiz Teles"
          placeholderTextColor={colors.slate400}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoComplete="name"
          editable={!isLoading}
        />
        {!!nameError && <Text style={styles.errorText}>{nameError}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="nome@exemplo.com"
          placeholderTextColor={colors.slate400}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          editable={!isLoading}
        />
        {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            placeholderTextColor={colors.slate400}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password-new"
            editable={!isLoading}
          />
          <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
            {showPassword ? <EyeOff size={20} color={colors.slate500} /> : <Eye size={20} color={colors.slate500} />}
          </TouchableOpacity>
        </View>
        {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color={colors.white} size="small" /> : <Text style={styles.submitButtonText}>Criar conta</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  inputGroup: { marginBottom: 18 },
  label: { fontFamily: font.medium, fontSize: 14, color: colors.slate700, marginBottom: 8 },
  input: {
    fontFamily: font.regular,
    height: 50,
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: radius.sm,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    fontSize: 16,
    color: colors.slate900,
  },
  inputError: { borderColor: colors.red500 },
  errorText: { fontFamily: font.regular, color: colors.red500, fontSize: 12, marginTop: 4 },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
  },
  passwordInput: { flex: 1, fontFamily: font.regular, paddingHorizontal: 16, fontSize: 16, color: colors.slate900 },
  eyeButton: { padding: 12 },
  submitButton: {
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.green600,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: { backgroundColor: colors.green500, opacity: 0.7 },
  submitButtonText: { fontFamily: font.bold, color: colors.white, fontSize: 16 },
});
