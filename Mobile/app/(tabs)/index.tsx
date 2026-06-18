import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from 'react-native';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityCard } from '@/components/dashboard/ActivityCard';
import { TrendingCard } from '@/components/dashboard/TrendingCard';
import { ProductionItem } from '@/types/production';

export default function DashboardScreen() {
  const { user, fetchProductionData, fetchRejectedData } = useAuth();
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productionData, setProductionData] = useState<ProductionItem[]>([]);
  const [rejectedData, setRejectedData] = useState<ProductionItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isDark = colorScheme === 'dark';

  const countByRamp = (rampNumber: number, data: ProductionItem[]) => {
    return data.filter(item => item.rampa === rampNumber).length;
  };

  const totalRamp1And2 = () =>
    countByRamp(1, productionData) + countByRamp(2, productionData);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodData, rejData] = await Promise.all([
        fetchProductionData(),
        fetchRejectedData()
      ]);
      setProductionData(prodData);
      setRejectedData(rejData);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const filteredProductionData = productionData.filter(item => item.rampa === 1 || item.rampa === 2);
  const totalRefugo = rejectedData.length;
  const totalProduzido = filteredProductionData.length;
  const taxaRefugo = totalProduzido + totalRefugo > 0
    ? (totalRefugo / (totalProduzido + totalRefugo)) * 100
    : 0;

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
              title="Rampa 1"
              value={countByRamp(1, productionData).toString()}
              status={countByRamp(1, productionData) > 0}
              iconName="conveyor-belt"
              color="#16a34a"
            />
            <StatsCard
              title="Rampa 2"
              value={countByRamp(2, productionData).toString()}
              status={countByRamp(2, productionData) > 0}
              iconName="conveyor-belt"
              color="#3b82f6"
            />
          </View>

          <View style={styles.statsContainer}>
            <StatsCard
              title="Total Rampa 1+2"
              value={totalRamp1And2().toString()}
              status={totalRamp1And2() > 0}
              iconName="layers"
              color="#334155"
            />
            <StatsCard
              title="Refugos"
              value={rejectedData.length.toString()}
              status={rejectedData.length > 0}
              iconName="alert-octagon"
              color="#EF4444"
            />
          </View>

          <View style={styles.statsContainer}>
            <StatsCard
              title="Total Produzido"
              value={(totalRamp1And2() + rejectedData.length).toString()}
              status={(totalRamp1And2() + rejectedData.length) > 0}
              iconName="package"
              color="#14B8A6"
              />

            <StatsCard
              title="Taxa de Refugo"
              value={`${taxaRefugo.toFixed(1)}%`}
              status={taxaRefugo < 99}
              iconName="trending-up"
              color="#EF4444"
            />
          </View>

          <TrendingCard productionData={productionData} />
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
    padding: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});
