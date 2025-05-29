import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from 'react-native';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityCard } from '@/components/dashboard/ActivityCard';
import { TrendingCard } from '@/components/dashboard/TrendingCard';
import { useState } from 'react';

export default function DashboardScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);
  const isDark = colorScheme === 'dark';

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['bottom']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <DashboardHeader userName={user?.name} />
          
          <View style={styles.statsContainer}>
            <StatsCard 
              title="Usuários" 
              value="12,592" 
              change={+12.3}
              iconName="users"
              color="#3B82F6" 
            />
            <StatsCard 
              title="Peças" 
              value="23" 
              change={+8.1}
              iconName="dollar-sign" 
              color="#14B8A6"
            />
          </View>
          
          <View style={styles.statsContainer}>
            <StatsCard 
              title="Tarefas" 
              value="248" 
              change={-2.5}
              iconName="check-square" 
              color="#9333EA"
            />
            <StatsCard 
              title="Realizadas" 
              value="86%" 
              change={+4.6}
              iconName="pie-chart" 
              color="#F59E0B"
            />
          </View>
          
          <TrendingCard />
          
          <ActivityCard />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  containerDark: {
    backgroundColor: '#080C15',
  },
  scrollContent: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});