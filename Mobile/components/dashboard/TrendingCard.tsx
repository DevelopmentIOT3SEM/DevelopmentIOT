import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ProductionItem } from '../../prisma/client';

interface TrendingCardProps {
  productionData: ProductionItem[];
}

export function TrendingCard({ productionData }: TrendingCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Função para contar produção por mês
  const getMonthlyCounts = () => {
    const counts = new Array(12).fill(0);

    productionData.forEach(item => {
      const month = new Date(item.timestampProducao).getMonth();
      counts[month] += 1;
    });

    return counts;
  };

  const monthlyCounts = getMonthlyCounts();

  // Pegando o mês atual e o anterior
  const currentMonth = new Date().getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  const currentCount = monthlyCounts[currentMonth];
  const previousCount = monthlyCounts[previousMonth];

  // Calculando crescimento
  const growth = previousCount === 0 ? 100 : ((currentCount - previousCount) / previousCount) * 100;

  const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        data: monthlyCounts,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Produção Mensal'],
  };

  const chartConfig = {
    backgroundGradientFrom: isDark ? '#1E293B' : '#FFFFFF',
    backgroundGradientTo: isDark ? '#1E293B' : '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(26, 33, 56, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '4', strokeWidth: '2', stroke: '#3B82F6' },
    propsForLabels: { fontFamily: 'Inter-Regular' },
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Crescimento Mensal</Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          {growth >= 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`} em relação ao mês passado
        </Text>
      </View>

      <LineChart
        data={data}
        width={300}
        height={160}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withShadow={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        horizontalLabelRotation={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
    alignItems: 'center',
  },
  containerDark: { backgroundColor: '#1E293B' },
  header: { width: '100%', marginBottom: 16 },
  title: { fontFamily: 'Inter-Bold', fontSize: 18, color: '#1A2138' },
  titleDark: { color: '#FFFFFF' },
  subtitle: { fontFamily: 'Inter-Regular', fontSize: 14, color: '#64748B' },
  subtitleDark: { color: '#94A3B8' },
  chart: { borderRadius: 12, paddingRight: 0 },
});
