import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { TrendingUp, TrendingDown, Users, DollarSign, SquareCheck as CheckSquare, ChartPie as PieChart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Package } from 'lucide-react-native'; // substituto para ConveyorBelt
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


interface StatsCardProps {
  title: string;
  value: string;
  change: boolean;
  iconName: 'users' | 'dollar-sign' | 'check-square' | 'pie-chart' | 'trending-up' | 'trending-down' | 'treasure-chest' | 'conveyor-belt';
  color: string;
}

export function StatsCard({ title, value, change, iconName, color }: StatsCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const renderIcon = () => {
    const props = { size: 24, color: color };
    
    switch (iconName) {
      case 'users':
        return <Users {...props} />;
      case 'dollar-sign':
        return <DollarSign {...props} />;
      case 'check-square':
        return <CheckSquare {...props} />;
      case 'pie-chart':
        return <PieChart {...props} />;
      case 'trending-up':
        return <TrendingUp {...props} />;
      case 'trending-down':
        return <TrendingDown {...props} />;
      case 'conveyor-belt':
         return <Package {...props} />;
         case 'treasure-chest':
         return <MaterialCommunityIcons name="treasure-chest" {...props} />;
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
              change ? styles.activeContainer : styles.inactiveContainer
                ]}>
              <Text style={change ? styles.activeText : styles.inactiveText}>
                {change ? 'Ativo' : 'Desativado'}
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
    marginHorizontal: 4,
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
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  positiveContainer: {
    backgroundColor: '#DCFCE7',
  },
  negativeContainer: {
    backgroundColor: '#FEE2E2',
  },
  positiveText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#10B981',
    marginLeft: 2,
  },
  negativeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#EF4444',
    marginLeft: 2,
  },
  period: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  periodDark: {
    color: '#94A3B8',
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