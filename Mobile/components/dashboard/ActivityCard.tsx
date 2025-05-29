import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useColorScheme } from 'react-native';
import { Check, X, UserPlus, ShoppingCart, Bell } from 'lucide-react-native';

type ActivityType = 'task' | 'user' | 'sale' | 'alert';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  status?: 'completed' | 'failed';
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'task',
    title: 'Rotação de peças',
    description: 'Rotação das peças concluído',
    time: 'há 2h',
    status: 'completed',
  },
  {
    id: '2',
    type: 'user',
    title: 'Novo Usuário',
    description: 'João Silva entrou',
    time: 'há 3h',
  },
  {
    id: '3',
    type: 'sale',
    title: 'Esteira cheia',
    description: 'Esteira de peças grandes cheia',
    time: 'há 5h',
  },
  {
    id: '4',
    type: 'task',
    title: 'Integração com API',
    description: 'Falha ao conectar ao servidor',
    time: 'há 1 dia',
    status: 'failed',
  },
  {
    id: '5',
    type: 'alert',
    title: 'Alerta do Sistema',
    description: 'Armazenamento 85% cheio',
    time: 'há 1 dia',
  },
];

export function ActivityCard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const renderActivityIcon = (type: ActivityType, status?: string) => {
    if (type === 'task') {
      if (status === 'completed') {
        return (
          <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
            <Check size={14} color="#10B981" />
          </View>
        );
      } else if (status === 'failed') {
        return (
          <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
            <X size={14} color="#EF4444" />
          </View>
        );
      }
    } else if (type === 'user') {
      return (
        <View style={[styles.iconContainer, { backgroundColor: '#E0E7FF' }]}>
          <UserPlus size={14} color="#6366F1" />
        </View>
      );
    } else if (type === 'sale') {
      return (
        <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
          <ShoppingCart size={14} color="#3B82F6" />
        </View>
      );
    } else if (type === 'alert') {
      return (
        <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
          <Bell size={14} color="#F59E0B" />
        </View>
      );
    }
    
    return null;
  };
  
  const renderItem = ({ item }: { item: Activity }) => (
    <View style={styles.activityItem}>
      {renderActivityIcon(item.type, item.status)}
      <View style={styles.activityContent}>
        <Text style={[styles.activityTitle, isDark && styles.activityTitleDark]}>
          {item.title}
        </Text>
        <Text style={[styles.activityDescription, isDark && styles.activityDescriptionDark]}>
          {item.description}
        </Text>
      </View>
      <Text style={[styles.activityTime, isDark && styles.activityTimeDark]}>
        {item.time}
      </Text>
    </View>
  );
  
  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Atividades Recentes</Text>
      </View>
      
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
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
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1A2138',
    marginBottom: 2,
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
    marginLeft: 8,
  },
  activityTimeDark: {
    color: '#64748B',
  },
});