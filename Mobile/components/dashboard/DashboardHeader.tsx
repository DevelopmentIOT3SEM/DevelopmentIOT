import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName = 'Usuário' }: DashboardHeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const getCurrentGreeting = (): string => {
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
      return 'Bom dia';
    } else if (currentHour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={[styles.greeting, isDark && styles.greetingDark]}>
          {getCurrentGreeting()},
        </Text>
        <Text style={[styles.name, isDark && styles.nameDark]}>
          {userName || 'Usuário'}
        </Text>
      </View>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
        Aqui está o resumo da sua performance
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1A2138',
    marginRight: 6,
  },
  greetingDark: {
    color: '#FFFFFF',
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#3B82F6',
  },
  nameDark: {
    color: '#60A5FA',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
  },
  subtitleDark: {
    color: '#94A3B8',
  },
});