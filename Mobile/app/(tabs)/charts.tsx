import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { ChartSelector } from '@/components/charts/ChartSelector';
import { ChartTimeFrameSelector } from '@/components/charts/ChartTimeFrameSelector';

export default function ChartsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeChart, setActiveChart] = useState('line');
  const [timeFrame, setTimeFrame] = useState('week');
  
  const screenWidth = Dimensions.get('window').width - 32;
  
  const chartConfig = {
    backgroundGradientFrom: isDark ? '#1E293B' : '#FFFFFF',
    backgroundGradientTo: isDark ? '#1E293B' : '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(26, 33, 56, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#3B82F6',
    },
    propsForLabels: {
      fontFamily: 'Inter-Regular',
    },
  };
  
  const lineData = {
    labels: timeFrame === 'week' ? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] : 
            timeFrame === 'month' ? ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'] : 
            ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        data: timeFrame === 'week' ? [20, 45, 28, 80, 99, 43, 50] :
              timeFrame === 'month' ? [150, 220, 280, 320] :
              [300, 450, 620, 580, 670, 720],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
  
  const barData = {
    labels: timeFrame === 'week' ? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] : 
            timeFrame === 'month' ? ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'] : 
            ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        data: timeFrame === 'week' ? [20, 45, 28, 80, 99, 43, 50] :
              timeFrame === 'month' ? [150, 220, 280, 320] :
              [300, 450, 620, 580, 670, 720],
      },
    ],
  };
  
  const pieData = [
    {
      name: 'Rampa 1',
      population: 45,
      color: '#3B82F6',
      legendFontColor: isDark ? '#FFFFFF' : '#1A2138',
      legendFontFamily: 'Inter-Regular',
    },
    {
      name: 'Rampa 2',
      population: 28,
      color: '#14B8A6',
      legendFontColor: isDark ? '#FFFFFF' : '#1A2138',
      legendFontFamily: 'Inter-Regular',
    },
    {
      name: 'Refugo',
      population: 17,
      color: '#9333EA',
      legendFontColor: isDark ? '#FFFFFF' : '#1A2138',
      legendFontFamily: 'Inter-Regular',
    },
    
  ];
  
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
          
          <View style={[styles.statsContainer, isDark && styles.statsContainerDark]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.statValueDark]}>15</Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Total de peças</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.statValueDark]}>+23,5%</Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Taxa de Crescimento</Text>
            </View>
          </View>
          
          <View style={[styles.insightsContainer, isDark && styles.insightsContainerDark]}>
            <Text style={[styles.insightsTitle, isDark && styles.insightsTitleDark]}>Principais Insights</Text>
            <View style={styles.insightItem}>
              <View style={[styles.insightDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={[styles.insightText, isDark && styles.insightTextDark]}>
                Vendas aumentaram 18% comparado ao último {timeFrame === 'week' ? 'semana' : timeFrame === 'month' ? 'mês' : 'ano'}
              </Text>
            </View>
            <View style={styles.insightItem}>
              <View style={[styles.insightDot, { backgroundColor: '#14B8A6' }]} />
              <Text style={[styles.insightText, isDark && styles.insightTextDark]}>
                Produto B mostra maior taxa de crescimento em 32%
              </Text>
            </View>
            <View style={styles.insightItem}>
              <View style={[styles.insightDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.insightText, isDark && styles.insightTextDark]}>
                Retenção de clientes melhorou para 78% neste {timeFrame === 'week' ? 'semana' : timeFrame === 'month' ? 'mês' : 'ano'}
              </Text>
            </View>
          </View>
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
  statsContainer: {
    flexDirection: 'row',
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
  statsContainerDark: {
    backgroundColor: '#1E293B',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1A2138',
    marginBottom: 4,
  },
  statValueDark: {
    color: '#FFFFFF',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  statLabelDark: {
    color: '#94A3B8',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  insightsContainer: {
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
  insightsContainerDark: {
    backgroundColor: '#1E293B',
  },
  insightsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1A2138',
    marginBottom: 12,
  },
  insightsTitleDark: {
    color: '#FFFFFF',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  insightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1A2138',
    flex: 1,
  },
  insightTextDark: {
    color: '#E2E8F0',
  },
});