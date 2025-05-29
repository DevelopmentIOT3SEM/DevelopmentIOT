import React from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { ChartBar as BarChart2, Chrome as Home, MessageSquare, LogOut } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const { isAuthenticated, logout } = useAuth();



export default function TabsLayout() {
  const { isAuthenticated, logout } = useAuth();
  const colorScheme = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: isDark ? '#94A3B8' : '#64748B',
        tabBarStyle: {
          backgroundColor: isDark ? '#1A2138' : '#FFFFFF',
          borderTopColor: isDark ? '#334155' : '#E2E8F0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginTop: -4,
        },
        headerStyle: {
          backgroundColor: isDark ? '#1A2138' : '#FFFFFF',
          borderBottomColor: isDark ? '#334155' : '#E2E8F0',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-Bold',
          fontSize: 16,
          color: isDark ? '#FFFFFF' : '#1A2138',
        },
        headerRight: () => (
          <Pressable 
            style={styles.logoutButton}
            onPress={() => logout()}
          >
            <LogOut size={20} color={isDark ? '#FFFFFF' : '#1A2138'} />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: 'Dashboard',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          title: 'Gráficos',
          headerTitle: 'Análises',
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Chatbot',
          headerTitle: 'Assistente',
          tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 16,
    padding: 8,
  }
});