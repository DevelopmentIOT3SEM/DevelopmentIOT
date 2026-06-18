import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';

export type TimeFrame = 'week' | 'month' | 'year';

interface ChartTimeFrameSelectorProps {
  timeFrame: TimeFrame;
  setTimeFrame: (timeFrame: TimeFrame) => void;
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    justifyContent: 'flex-start', // alinhado à esquerda
    width: 120,                    // largura menor pro container
  },
  containerDark: {
    backgroundColor: '#1E293B',
  },
  option: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,        // menos padding pra ficar menor
    borderRadius: 6,
  },
  activeOption: {
    backgroundColor: '#dcfce7',
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
    color: '#16a34a',
  },
  textDark: {
    color: '#94A3B8',
  },
  activeTextDark: {
    color: '#FFFFFF',
  },
});
