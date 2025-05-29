import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';

interface ChartTimeFrameSelectorProps {
  timeFrame: string;
  setTimeFrame: (timeFrame: string) => void;
}

export function ChartTimeFrameSelector({ timeFrame, setTimeFrame }: ChartTimeFrameSelectorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <TouchableOpacity
        style={[
          styles.option,
          timeFrame === 'week' && styles.activeOption,
          timeFrame === 'week' && isDark && styles.activeOptionDark,
        ]}
        onPress={() => setTimeFrame('week')}
      >
        <Text 
          style={[
            styles.optionText,
            timeFrame === 'week' && styles.activeText,
            isDark && styles.textDark,
            timeFrame === 'week' && isDark && styles.activeTextDark,
          ]}
        >
          Semana
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          timeFrame === 'month' && styles.activeOption,
          timeFrame === 'month' && isDark && styles.activeOptionDark,
        ]}
        onPress={() => setTimeFrame('month')}
      >
        <Text 
          style={[
            styles.optionText,
            timeFrame === 'month' && styles.activeText,
            isDark && styles.textDark,
            timeFrame === 'month' && isDark && styles.activeTextDark,
          ]}
        >
          Mês
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          timeFrame === 'year' && styles.activeOption,
          timeFrame === 'year' && isDark && styles.activeOptionDark,
        ]}
        onPress={() => setTimeFrame('year')}
      >
        <Text 
          style={[
            styles.optionText,
            timeFrame === 'year' && styles.activeText,
            isDark && styles.textDark,
            timeFrame === 'year' && isDark && styles.activeTextDark,
          ]}
        >
          Ano
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