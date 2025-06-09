import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { ChartSelector } from '@/components/charts/ChartSelector';
import { ChartTimeFrameSelector } from '@/components/charts/ChartTimeFrameSelector';
import { useAuth } from '@/context/AuthContext'; 

export default function ChartsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { fetchProductionData, fetchRejectedData } = useAuth();

  const [activeChart, setActiveChart] = useState('line');
  const [timeFrame, setTimeFrame] = useState('week');
  const [productionData, setProductionData] = useState<any[]>([]);
  const [rejectedData, setRejectedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get('window').width - 32;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const prod = await fetchProductionData();
        const rej = await fetchRejectedData();
        setProductionData(prod);
        setRejectedData(rej);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [timeFrame]);


  const groupByDayOfWeek = (data: any[]) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const counts = Array(7).fill(0);

    data.forEach(item => {
      const date = new Date(item.timestampProducao);
      const day = date.getDay(); // 0 (Dom) - 6 (Sáb)
      counts[day]++;
    });

    
    const reorderedLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const reorderedCounts = [
      counts[1],
      counts[2],
      counts[3],
      counts[4],
      counts[5],
      counts[6],
      counts[0],
    ];

    return { labels: reorderedLabels, counts: reorderedCounts };
  };

  // Dados para LineChart e BarChart
  const { labels, counts } = groupByDayOfWeek(productionData);


  const rampCounts = productionData.reduce((acc: Record<number, number>, cur) => {
    acc[cur.rampa] = (acc[cur.rampa] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(rampCounts).map(([rampa, count], index) => {
    const colors = ['#3B82F6', '#14B8A6', '#9333EA', '#F59E0B', '#EF4444']; // cores para as rampas
    return {
      name: `Rampa ${rampa}`,
      population: count,
      color: colors[index % colors.length],
      legendFontColor: isDark ? '#FFFFFF' : '#1A2138',
      legendFontFamily: 'Inter-Regular',
    };
  });

  // Config do gráfico
  const chartConfig = {
    backgroundGradientFrom: isDark ? '#1E293B' : '#FFFFFF',
    backgroundGradientTo: isDark ? '#1E293B' : '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(26, 33, 56, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '6', strokeWidth: '2', stroke: '#3B82F6' },
    propsForLabels: { fontFamily: 'Inter-Regular' },
  };

  const lineData = {
    labels,
    datasets: [{ data: counts, color: () => '#3B82F6', strokeWidth: 2 }],
  };

  const barData = {
    labels,
    datasets: [{ data: counts }],
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
          <View style={styles.headerContainer}>
            <Text style={[styles.title, isDark && styles.titleDark]}>Análise de Dados</Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              Visualize o desempenho do seu negócio
            </Text>
          </View>

          <View style={styles.chartControls}>
            <ChartSelector activeChart={activeChart} setActiveChart={setActiveChart} />
            <ChartTimeFrameSelector timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
          </View>

          <View style={[styles.chartContainer, isDark && styles.chartContainerDark]}>
            {activeChart === 'line' && (
              <LineChart
                data={lineData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            )}

            {activeChart === 'bar' && (
              <BarChart
                data={barData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisLabel=""
                yAxisSuffix=""
                showValuesOnTopOfBars
              />
            )}

            {activeChart === 'pie' && (
              <PieChart
                data={pieData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                style={styles.chart}
              />
            )}
          </View>
          {}
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
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1A2138',
    marginBottom: 4,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
  },
  subtitleDark: {
    color: '#94A3B8',
  },
  chartControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartContainerDark: {
    backgroundColor: '#1E293B',
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
  
});
