import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { ChartSelector } from '@/components/charts/ChartSelector';
import { ChartTimeFrameSelector } from '@/components/charts/ChartTimeFrameSelector';
import { useAuth } from '@/context/AuthContext';
import { ProductionItem } from '@/types/production';

export default function ChartsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { fetchProductionData, fetchRejectedData } = useAuth();

  // Estado dos seletores e dados
  const [activeChart, setActiveChart] = useState<'line' | 'bar' | 'pie'>('line');
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('week');
  const [productionData, setProductionData] = useState<ProductionItem[]>([]);
  const [rejectedData, setRejectedData] = useState<ProductionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get('window').width - 32;

  // Carregar e filtrar dados ao mudar o timeframe
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const prod = await fetchProductionData();
        const rej = await fetchRejectedData();

        // Filtrar produção para rampas 1 e 2
        const filteredProd = prod.filter(item => item.rampa === 1 || item.rampa === 2);

        // Filtrar refugo para rampas 1, 2 
        const filteredRej = rej.filter(item => [1, 2, 3].includes(item.rampa));

        setProductionData(filteredProd);
        setRejectedData(filteredRej);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [timeFrame]);

  // Função para agrupar dados por dia da semana
  const groupByDayOfWeek = (data: ProductionItem[]) => {
    // Labels em ordem segunda a domingo
    const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const counts = Array(7).fill(0);

    data.forEach(item => {
      const date = new Date(item.timestampProducao);
      let day = date.getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb

      // Ajusta domingo para posição 6 e segunda para 0
      day = day === 0 ? 6 : day - 1;

      counts[day]++;
    });

    return { labels, counts };
  };

  // Dados agrupados para produção e refugo
  const productionByDay = groupByDayOfWeek(productionData);
  const rejectedByDay = groupByDayOfWeek(rejectedData);

  // Dados para gráfico de pizza da produção: contagem por rampa (1 e 2)
  const rampCountsProd = productionData.reduce((acc: Record<number, number>, cur) => {
    acc[cur.rampa] = (acc[cur.rampa] || 0) + 1;
    return acc;
  }, {});

  const pieDataProd = Object.entries(rampCountsProd).map(([rampa, count], index) => {
    const colors = ['#3B82F6', '#14B8A6', '#9333EA', '#F59E0B', '#EF4444'];
    return {
      name: `Rampa ${rampa}`,
      population: count,
      color: colors[index % colors.length],
      legendFontColor: isDark ? '#FFFFFF' : '#1A2138',
      legendFontFamily: 'Inter-Regular',
    };
  });

  // Dados para gráfico de pizza de refugo: rampas 1, 2 
  const rampCountsRej = rejectedData.reduce((acc: Record<number, number>, cur) => {
    acc[cur.rampa] = (acc[cur.rampa] || 0) + 1;
    return acc;
  }, {});

  const pieDataRej = Object.entries(rampCountsRej).map(([rampa, count], index) => {
    const colors = ['#EF4444', '#F59E0B', '#9333EA'];
    return {
      name: `Rampa ${rampa}`,
      population: count,
      color: colors[index % colors.length],
      legendFontColor: isDark ? '#FFFFFF' : '#1A2138',
      legendFontFamily: 'Inter-Regular',
    };
  });

  // Config geral dos gráficos
  const chartConfig = {
    backgroundGradientFrom: isDark ? '#0f172a' : '#ffffff',
    backgroundGradientTo: isDark ? '#1e293b' : '#f0f4f8',
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // azul
    labelColor: (opacity = 1) => isDark ? `rgba(229, 231, 235, ${opacity})` : `rgba(51, 65, 85, ${opacity})`,
    strokeWidth: 2,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#3B82F6',
    },
  };

  // Dados para gráficos de linha e barra (produção por dia)
  const lineData = {
    labels: productionByDay.labels,
    datasets: [
      {
        data: productionByDay.counts,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const barData = {
    labels: productionByDay.labels,
    datasets: [
      {
        data: productionByDay.counts,
      },
    ],
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <Text style={{ color: isDark ? 'white' : 'black', margin: 20 }}>Carregando dados...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

          <Text style={[styles.title, isDark && styles.titleDark]}>
            Produção por Dia da Semana (Rampas 1 e 2)
          </Text>

          <ChartSelector activeChart={activeChart} setActiveChart={setActiveChart} />
          <ChartTimeFrameSelector timeFrame={timeFrame} setTimeFrame={setTimeFrame} />

          <View style={{ marginTop: 20 }}>
            {activeChart === 'line' && (
              <LineChart
                data={lineData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chartStyle}
              />
            )}
            {activeChart === 'bar' && (
              <BarChart
                data={barData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                style={styles.chartStyle}
                yAxisLabel=""
                yAxisSuffix=""
              />
            )}
            {activeChart === 'pie' && (
              <PieChart
                data={pieDataProd}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            )}
          </View>

          <Text style={[styles.title, isDark && styles.titleDark, { marginTop: 40 }]}>
            Refugo por Dia da Semana (Rampas 1 e 2)
          </Text>

          {}
          <View style={{ marginTop: 20 }}>
            <LineChart
              data={{
                labels: rejectedByDay.labels,
                datasets: [
                  {
                    data: rejectedByDay.counts,
                    color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // vermelho para refugo
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                labelColor: (opacity = 1) => isDark ? `rgba(254, 202, 202, ${opacity})` : `rgba(153, 27, 27, ${opacity})`,
              }}
              bezier
              style={styles.chartStyle}
            />
          </View>

          <Text style={[styles.title, isDark && styles.titleDark, { marginTop: 40 }]}>
            Refugo por Rampa
          </Text>

          <PieChart
            data={pieDataRej}
            width={screenWidth}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
              labelColor: (opacity = 1) => isDark ? `rgba(254, 202, 202, ${opacity})` : `rgba(153, 27, 27, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={{ marginTop: 10 }}
          />

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1A2138',
    marginTop: 20,
  },
  titleDark: {
    color: '#F1F5F9',
  },
  chartStyle: {
    borderRadius: 16,
  },
});
