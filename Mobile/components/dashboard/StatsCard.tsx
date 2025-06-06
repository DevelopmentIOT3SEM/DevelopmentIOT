import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  SquareCheck as CheckSquare, 
  ChartPie as PieChart,
  Package
} from 'lucide-react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AlertOctagon } from 'lucide-react-native';

interface StatsCardProps {
  title: string;
  value: string;
  status: boolean;
  iconName: 'users' | 'dollar-sign' | 'check-square' | 'pie-chart' | 
           'trending-up' | 'trending-down' | 'treasure-chest' | 'conveyor-belt' |
           'alert-octagon' | 'package'; // Novos ícones
  color: string;
}

// Adicione no switch do renderIcon

export function StatsCard({ title, value, status, iconName, color }: StatsCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const renderIcon = () => {
    const iconProps = { size: 24, color: color };
    
    switch (iconName) {
      case 'users':
        return <Users {...iconProps} />;
      case 'dollar-sign':
        return <DollarSign {...iconProps} />;
      case 'check-square':
        return <CheckSquare {...iconProps} />;
      case 'pie-chart':
        return <PieChart {...iconProps} />;
      case 'trending-up':
        return <TrendingUp {...iconProps} />;
      case 'trending-down':
        return <TrendingDown {...iconProps} />;
      case 'conveyor-belt':
        return <Package {...iconProps} />;
      case 'treasure-chest':
        return <MaterialCommunityIcons name="treasure-chest" {...iconProps} />;
        case 'alert-octagon':
        return <AlertOctagon {...iconProps} />;
      case 'package':
        return <Package {...iconProps} />;
      default:
        return null;
    }
  };
  
  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          {renderIcon()}
        </View>
      </View>
      
      <Text style={[styles.value, isDark && styles.valueDark]}>{value}</Text>
      
      <View style={styles.footer}>
        <View style={[
          styles.statusContainer,
          status ? styles.activeContainer : styles.inactiveContainer
        ]}>
          <Text style={status ? styles.activeText : styles.inactiveText}>
            {status ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  containerDark: {
    backgroundColor: '#1E293B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  titleDark: {
    color: '#94A3B8',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1A2138',
    marginBottom: 12,
  },
  valueDark: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    
  },
  activeContainer: {
    backgroundColor: '#DCFCE7',
  },
  inactiveContainer: {
    backgroundColor: '#FEE2E2',
  },
  activeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#10B981',
  },
  inactiveText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#EF4444',
  },
});