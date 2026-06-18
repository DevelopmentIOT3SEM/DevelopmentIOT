import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { ShoppingCart, X } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext'; // ajuste o caminho para o seu projeto

interface CombinedItem {
  id: string;
  type: 'production' | 'rejected';
  rampa: number;
  timestamp: string;
}

export function ActivityCard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { fetchProductionData, fetchRejectedData } = useAuth();
  const [activities, setActivities] = useState<CombinedItem[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const loadActivities = async () => {
    try {
      const productionData = await fetchProductionData();
      const rejectedData = await fetchRejectedData();

      // Filtrar para remover itens com rampa 3
      const filteredProduction = productionData.filter(item => item.rampa !== 3);
      const filteredRejected = rejectedData.filter(item => item.rampa !== 3);

      const formattedProduction = filteredProduction.map(item => ({
        id: `P-${item.idProducao}`,
        type: 'production' as const,
        rampa: item.rampa,
        timestamp: item.timestampProducao,
      }));

      const formattedRejected = filteredRejected.map(item => ({
        id: `R-${item.idProducao}`,
        type: 'rejected' as const,
        rampa: item.rampa,
        timestamp: item.timestampProducao,
      }));

      const combined = [...formattedProduction, ...formattedRejected].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(combined);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    } finally {
      setLoading(false);
    }
  };

  loadActivities();
}, []);


  const renderItem = ({ item }: { item: CombinedItem }) => (
    <View style={styles.activityItem}>
      <View style={[styles.iconContainer, isDark && styles.iconContainerDark]}>
        {item.type === 'production' ? (
          <ShoppingCart size={16} color="#16a34a" />
        ) : (
          <X size={16} color="#EF4444" />
        )}
      </View>
      <View style={styles.activityContent}>
        <Text style={[styles.activityTitle, isDark && styles.activityTitleDark]}>
          {item.type === 'production' ? 'Peças Produzidas' : 'Peças Rejeitadas'}
        </Text>
        <Text style={[styles.activityDescription, isDark && styles.activityDescriptionDark]}>
          Rampa: {item.rampa}
        </Text>
        <Text style={[styles.activityTime, isDark && styles.activityTimeDark]}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Atividades Recentes</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#16a34a" />
      ) : activities.length > 0 ? (
        <FlatList
          data={activities}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      ) : (
        <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
          Nenhuma atividade encontrada.
        </Text>
      )}
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
  },
  containerDark: {
    backgroundColor: '#1E293B',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1A2138',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerDark: {
    backgroundColor: '#334155',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1A2138',
  },
  activityTitleDark: {
    color: '#FFFFFF',
  },
  activityDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  activityDescriptionDark: {
    color: '#94A3B8',
  },
  activityTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  activityTimeDark: {
    color: '#CBD5E1',
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  emptyTextDark: {
    color: '#94A3B8',
  },
});
