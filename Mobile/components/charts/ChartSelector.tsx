import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { ChartBar as BarChart, ChartLine as LineChart, ChartPie as PieChart } from 'lucide-react-native';

interface ChartSelectorProps {
  activeChart: string;
  setActiveChart: (chart: string) => void;
}

export function ChartSelector({ activeChart, setActiveChart }: ChartSelectorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <TouchableOpacity
        style={[
          styles.option,
          activeChart === 'line' && styles.activeOption,
          activeChart === 'line' && isDark && styles.activeOptionDark,
        ]}
        onPress={() => setActiveChart('line')}
      >
        <LineChart 
          size={18} 
          color={activeChart === 'line' 
            ? (isDark ? '#FFFFFF' : '#3B82F6')
            : (isDark ? '#94A3B8' : '#64748B')
          } 
        />
        <Text 
          style={[
            styles.optionText,
            activeChart === 'line' && styles.activeText,
            isDark && styles.textDark,
            activeChart === 'line' && isDark && styles.activeTextDark,
          ]}
        >
          Linha
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          activeChart === 'bar' && styles.activeOption,
          activeChart === 'bar' && isDark && styles.activeOptionDark,
        ]}
        onPress={() => setActiveChart('bar')}
      >
        <BarChart 
          size={18} 
          color={activeChart === 'bar' 
            ? (isDark ? '#FFFFFF' : '#3B82F6')
            : (isDark ? '#94A3B8' : '#64748B')
          } 
        />
        <Text 
          style={[
            styles.optionText,
            activeChart === 'bar' && styles.activeText,
            isDark && styles.textDark,
            activeChart === 'bar' && isDark && styles.activeTextDark,
          ]}
        >
          Barra
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          activeChart === 'pie' && styles.activeOption,
          activeChart === 'pie' && isDark && styles.activeOptionDark,
        ]}
        onPress={() => setActiveChart('pie')}
      >
        <PieChart 
          size={18} 
          color={activeChart === 'pie' 
            ? (isDark ? '#FFFFFF' : '#3B82F6')
            : (isDark ? '#94A3B8' : '#64748B')
          } 
        />
        <Text 
          style={[
            styles.optionText,
            activeChart === 'pie' && styles.activeText,
            isDark && styles.textDark,
            activeChart === 'pie' && isDark && styles.activeTextDark,
          ]}
        >
          Pizza
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
  },
  containerDark: {
    backgroundColor: '#1E293B',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeOption: {
    backgroundColor: '#EBF5FF',
  },
  activeOptionDark: {
    backgroundColor: '#1E40AF',
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
  },
  activeText: {
    color: '#3B82F6',
  },
  textDark: {
    color: '#94A3B8',
  },
  activeTextDark: {
    color: '#FFFFFF',
  },
});