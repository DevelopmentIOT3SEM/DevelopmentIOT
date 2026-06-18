import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';


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
    if (validateForm()) {
      onSubmit(name, email, password);
    }
  };

  return (
    <View style={styles.container}>
      {/* Campo Nome */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={[styles.input, nameError ? styles.inputError : null]}
          placeholder="exemplo: Luiz Teles"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoComplete="name"
          editable={!isLoading}
        />
        {!!nameError && <Text style={styles.errorText}>{nameError}</Text>}
      </View>

      {/* Campo Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="nome@exemplo.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          editable={!isLoading}
        />
        {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
      </View>

      {/* Campo Senha */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password-new"
            editable={!isLoading}
          />
          <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
            {showPassword ? <EyeOff size={20} color="#64748B" /> : <Eye size={20} color="#64748B" />}
          </TouchableOpacity>
        </View>
        {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      </View>

      {/* Botão de Submit */}
      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.submitButtonText}>Criar Conta</Text>}
      </TouchableOpacity>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    height: 48,
    borderWidth: 1,
    borderColor: '#4C4C4C',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4C4C4C',
    fontSize: 16,
    color: '#7A7A7A',
  },
  inputError: {
    borderColor: '#E11D48',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    color: '#E11D48',
    fontSize: 12,
    marginTop: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#7A7A7A',
    borderRadius: 8,
    backgroundColor: '#4C4C4C',
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#7A7A7A',
  },
  eyeButton: {
    padding: 10,
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#5088BD',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  submitButtonText: {
    fontFamily: 'Inter-Medium',
    color: '#484848',
    fontSize: 16,
  }
});